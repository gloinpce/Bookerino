import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// import { setupAuth, authenticateJWT } from "./replitAuth"; // Commented out - using local auth
import { insertRoomSchema, insertBookingSchema, insertReviewSchema, updateReviewResponseSchema, insertIntegrationSchema, insertMealSchema } from "@shared/schema";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerificationEmail,
  sendTrialEndingReminderEmail,
  sendSubscriptionConfirmationEmail,
  sendFeatureUpdateEmail,
} from "./email";

// JWT Authentication Middleware
const authenticateJWT = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'Token lipsă' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware (commented out - using local auth with Neon PostgreSQL)
  // await setupAuth(app);

  // Local Auth routes (using Neon PostgreSQL)
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii' });
      }

      // Check if user already exists
      const [existingUser] = await db.select().from(users).where(eq(users.email, email));
      if (existingUser) {
        return res.status(400).json({ error: 'Email-ul este deja folosit' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Split name into first and last name
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Create user
      const [newUser] = await db.insert(users).values({
        email,
        firstName,
        lastName,
        passwordHash,
      }).returning();

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
        { expiresIn: '7d' }
      );

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Eroare la înregistrare' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email și parolă sunt obligatorii' });
      }

      // Find user by email
      const [user] = await db.select().from(users).where(eq(users.email, email));
      if (!user || !user.passwordHash) {
        return res.status(401).json({ error: 'Email sau parolă incorectă' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Email sau parolă incorectă' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
        { expiresIn: '7d' }
      );

      // Return user without password hash
      const { passwordHash: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Eroare la autentificare' });
    }
  });

  // Auth routes - Get current user (using JWT token)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'Token lipsă' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here') as any;
      const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));
      
      if (!user) {
        return res.status(404).json({ message: 'Utilizator negăsit' });
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(401).json({ message: "Token invalid" });
    }
  });

  // Room routes
  app.get("/api/rooms", authenticateJWT, async (req, res) => {
    try {
      const rooms = await storage.getRooms();
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  app.post("/api/rooms", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertRoomSchema.parse(req.body);
      const room = await storage.createRoom(validatedData);
      res.json(room);
    } catch (error) {
      console.error("Error creating room:", error);
      res.status(500).json({ message: "Failed to create room" });
    }
  });

  app.patch("/api/rooms/:id", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertRoomSchema.partial().parse(req.body);
      const room = await storage.updateRoom(req.params.id, validatedData);
      res.json(room);
    } catch (error) {
      console.error("Error updating room:", error);
      res.status(500).json({ message: "Failed to update room" });
    }
  });

  app.delete("/api/rooms/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteRoom(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting room:", error);
      res.status(500).json({ message: "Failed to delete room" });
    }
  });

  // Booking routes
  app.get("/api/bookings", authenticateJWT, async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.post("/api/bookings", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertBookingSchema.partial().parse(req.body);
      const booking = await storage.updateBooking(req.params.id, validatedData);
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking:", error);
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  app.delete("/api/bookings/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteBooking(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Failed to delete booking" });
    }
  });

  // Review routes
  app.get("/api/reviews", authenticateJWT, async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.patch("/api/reviews/:id", authenticateJWT, async (req, res) => {
    try {
      const validatedData = updateReviewResponseSchema.parse(req.body);
      const review = await storage.updateReview(req.params.id, validatedData);
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteReview(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Advanced Analytics routes
  app.get("/api/analytics/advanced", authenticateJWT, async (req, res) => {
    try {
      const analytics = await storage.getAdvancedAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching advanced analytics:", error);
      res.status(500).json({ message: "Failed to fetch advanced analytics" });
    }
  });

  // Integration routes
  app.get("/api/integrations", authenticateJWT, async (req, res) => {
    try {
      const integrations = await storage.getIntegrations();
      res.json(integrations);
    } catch (error) {
      console.error("Error fetching integrations:", error);
      res.status(500).json({ message: "Failed to fetch integrations" });
    }
  });

  app.post("/api/integrations", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.parse(req.body);
      const integration = await storage.createIntegration(validatedData);
      res.json(integration);
    } catch (error) {
      console.error("Error creating integration:", error);
      res.status(500).json({ message: "Failed to create integration" });
    }
  });

  app.patch("/api/integrations/:id", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertIntegrationSchema.partial().parse(req.body);
      const integration = await storage.updateIntegration(req.params.id, validatedData);
      res.json(integration);
    } catch (error) {
      console.error("Error updating integration:", error);
      res.status(500).json({ message: "Failed to update integration" });
    }
  });

  app.delete("/api/integrations/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteIntegration(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting integration:", error);
      res.status(500).json({ message: "Failed to delete integration" });
    }
  });

  // Meal routes
  app.get("/api/meals", authenticateJWT, async (req, res) => {
    try {
      const meals = await storage.getMeals();
      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.post("/api/meals", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertMealSchema.parse(req.body);
      const meal = await storage.createMeal(validatedData);
      res.json(meal);
    } catch (error) {
      console.error("Error creating meal:", error);
      res.status(500).json({ message: "Failed to create meal" });
    }
  });

  app.patch("/api/meals/:id", authenticateJWT, async (req, res) => {
    try {
      const validatedData = insertMealSchema.partial().parse(req.body);
      const meal = await storage.updateMeal(req.params.id, validatedData);
      res.json(meal);
    } catch (error) {
      console.error("Error updating meal:", error);
      res.status(500).json({ message: "Failed to update meal" });
    }
  });

  app.delete("/api/meals/:id", authenticateJWT, async (req, res) => {
    try {
      await storage.deleteMeal(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting meal:", error);
      res.status(500).json({ message: "Failed to delete meal" });
    }
  });

  app.post("/api/meals/:id/consume", authenticateJWT, async (req, res) => {
    try {
      const meal = await storage.incrementMealConsumption(req.params.id);
      res.json(meal);
    } catch (error) {
      console.error("Error incrementing meal consumption:", error);
      res.status(500).json({ message: "Failed to increment meal consumption" });
    }
  });

  // Email API routes
  // Send custom email
  app.post("/api/email/send", authenticateJWT, async (req, res) => {
    try {
      const { userIds, subject, html, templateId, variables, notificationCategoryName } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "userIds must be a non-empty array" });
      }

      if (!subject && !templateId) {
        return res.status(400).json({ error: "subject or templateId is required" });
      }

      const result = await sendEmail({
        userIds,
        subject,
        html,
        templateId,
        variables,
        notificationCategoryName,
      });

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send email" });
      }

      res.json({ success: true, message: result.message });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Send welcome email
  app.post("/api/email/welcome", authenticateJWT, async (req, res) => {
    try {
      const { userId, userName } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }

      const result = await sendWelcomeEmail(userId, userName);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send welcome email" });
      }

      res.json({ success: true, message: "Welcome email sent successfully" });
    } catch (error) {
      console.error("Error sending welcome email:", error);
      res.status(500).json({ error: "Failed to send welcome email" });
    }
  });

  // Send password reset email
  app.post("/api/email/password-reset", async (req, res) => {
    try {
      const { userId, resetUrl } = req.body;

      if (!userId || !resetUrl) {
        return res.status(400).json({ error: "userId and resetUrl are required" });
      }

      const result = await sendPasswordResetEmail(userId, resetUrl);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send password reset email" });
      }

      res.json({ success: true, message: "Password reset email sent successfully" });
    } catch (error) {
      console.error("Error sending password reset email:", error);
      res.status(500).json({ error: "Failed to send password reset email" });
    }
  });

  // Send email verification
  app.post("/api/email/verify", authenticateJWT, async (req, res) => {
    try {
      const { userId, verificationUrl } = req.body;

      if (!userId || !verificationUrl) {
        return res.status(400).json({ error: "userId and verificationUrl are required" });
      }

      const result = await sendEmailVerificationEmail(userId, verificationUrl);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send verification email" });
      }

      res.json({ success: true, message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  // Send trial ending reminder
  app.post("/api/email/trial-reminder", authenticateJWT, async (req, res) => {
    try {
      const { userId, userName, daysRemaining } = req.body;

      if (!userId || !userName || daysRemaining === undefined) {
        return res.status(400).json({ error: "userId, userName, and daysRemaining are required" });
      }

      const result = await sendTrialEndingReminderEmail(userId, userName, daysRemaining);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send trial reminder email" });
      }

      res.json({ success: true, message: "Trial reminder email sent successfully" });
    } catch (error) {
      console.error("Error sending trial reminder email:", error);
      res.status(500).json({ error: "Failed to send trial reminder email" });
    }
  });

  // Send subscription confirmation
  app.post("/api/email/subscription-confirmation", authenticateJWT, async (req, res) => {
    try {
      const { userId, userName, planName, amount } = req.body;

      if (!userId || !userName || !planName || !amount) {
        return res.status(400).json({ error: "userId, userName, planName, and amount are required" });
      }

      const result = await sendSubscriptionConfirmationEmail(userId, userName, planName, amount);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send subscription confirmation email" });
      }

      res.json({ success: true, message: "Subscription confirmation email sent successfully" });
    } catch (error) {
      console.error("Error sending subscription confirmation email:", error);
      res.status(500).json({ error: "Failed to send subscription confirmation email" });
    }
  });

  // Send feature update email (marketing)
  app.post("/api/email/feature-update", authenticateJWT, async (req, res) => {
    try {
      const { userIds, featureName, featureDescription, featureUrl } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "userIds must be a non-empty array" });
      }

      if (!featureName || !featureDescription) {
        return res.status(400).json({ error: "featureName and featureDescription are required" });
      }

      const result = await sendFeatureUpdateEmail(userIds, featureName, featureDescription, featureUrl);

      if (result.status === "error") {
        return res.status(400).json({ error: result.error?.message || "Failed to send feature update email" });
      }

      res.json({ success: true, message: "Feature update email sent successfully" });
    } catch (error) {
      console.error("Error sending feature update email:", error);
      res.status(500).json({ error: "Failed to send feature update email" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
