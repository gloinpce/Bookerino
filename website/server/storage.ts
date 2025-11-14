import {
  users,
  rooms,
  bookings,
  reviews,
  integrations,
  meals,
  type User,
  type UpsertUser,
  type Room,
  type InsertRoom,
  type Booking,
  type InsertBooking,
  type Review,
  type InsertReview,
  type Integration,
  type InsertIntegration,
  type Meal,
  type InsertMeal,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Room operations
  getRooms(): Promise<Room[]>;
  getRoom(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, room: Partial<InsertRoom>): Promise<Room>;
  deleteRoom(id: string): Promise<void>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: string, booking: Partial<InsertBooking>): Promise<Booking>;
  deleteBooking(id: string): Promise<void>;
  
  // Review operations
  getReviews(): Promise<Review[]>;
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: string, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: string): Promise<void>;

  // Analytics operations
  getAdvancedAnalytics(): Promise<any>;

  // Integration operations
  getIntegrations(): Promise<Integration[]>;
  getIntegration(id: string): Promise<Integration | undefined>;
  getIntegrationByPlatform(platform: string): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  updateIntegration(id: string, integration: Partial<InsertIntegration>): Promise<Integration>;
  deleteIntegration(id: string): Promise<void>;

  // Meal operations
  getMeals(): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: string, meal: Partial<InsertMeal>): Promise<Meal>;
  deleteMeal(id: string): Promise<void>;
  incrementMealConsumption(id: string): Promise<Meal>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Room operations
  async getRooms(): Promise<Room[]> {
    return await db.select().from(rooms);
  }

  async getRoom(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async createRoom(roomData: InsertRoom): Promise<Room> {
    const [room] = await db.insert(rooms).values(roomData).returning();
    return room;
  }

  async updateRoom(id: string, roomData: Partial<InsertRoom>): Promise<Room> {
    const [room] = await db
      .update(rooms)
      .set(roomData)
      .where(eq(rooms.id, id))
      .returning();
    return room;
  }

  async deleteRoom(id: string): Promise<void> {
    await db.delete(rooms).where(eq(rooms.id, id));
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(bookingData: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(bookingData).returning();
    return booking;
  }

  async updateBooking(id: string, bookingData: Partial<InsertBooking>): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set(bookingData)
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  async deleteBooking(id: string): Promise<void> {
    await db.delete(bookings).where(eq(bookings.id, id));
  }

  // Review operations
  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews);
  }

  async getReview(id: string): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(reviewData).returning();
    return review;
  }

  async updateReview(id: string, reviewData: Partial<InsertReview>): Promise<Review> {
    const [review] = await db
      .update(reviews)
      .set(reviewData)
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async deleteReview(id: string): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Advanced Analytics operations
  async getAdvancedAnalytics(): Promise<any> {
    const allBookings = await db.select().from(bookings);
    const allRooms = await db.select().from(rooms);
    
    // Calculate revenue trend (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    
    const revenueTrend = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = monthDate.toLocaleDateString('ro-RO', { month: 'short', year: 'numeric' });
      const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
      
      const monthRevenue = allBookings
        .filter(b => {
          const bookingDate = new Date(b.createdAt);
          return bookingDate >= monthStart && bookingDate <= monthEnd && b.status === 'confirmed';
        })
        .reduce((sum, b) => {
          const price = parseFloat(b.totalPrice || "0");
          return sum + (Number.isFinite(price) ? price : 0);
        }, 0);
      
      revenueTrend.push({ month: monthName, revenue: parseFloat(monthRevenue.toFixed(2)) });
    }
    
    // Calculate occupancy rate
    const today = new Date();
    const occupiedRooms = allBookings.filter(b => {
      const checkIn = new Date(b.checkIn);
      const checkOut = new Date(b.checkOut);
      return checkIn <= today && checkOut >= today && (b.status === 'confirmed' || b.status === 'checked-in');
    }).length;
    
    const occupancyRate = allRooms.length > 0 
      ? parseFloat(((occupiedRooms / allRooms.length) * 100).toFixed(1))
      : 0;
    
    // Calculate booking sources
    const sourceCounts = allBookings.reduce((acc: any, b) => {
      const source = b.source || 'direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {});
    
    const bookingSources = Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      revenueTrend,
      occupancyRate,
      bookingSources
    };
  }

  // Integration operations
  async getIntegrations(): Promise<Integration[]> {
    return await db.select().from(integrations);
  }

  async getIntegration(id: string): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration;
  }

  async getIntegrationByPlatform(platform: string): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.platform, platform));
    return integration;
  }

  async createIntegration(integrationData: InsertIntegration): Promise<Integration> {
    const [integration] = await db.insert(integrations).values(integrationData).returning();
    return integration;
  }

  async updateIntegration(id: string, integrationData: Partial<InsertIntegration>): Promise<Integration> {
    const [integration] = await db
      .update(integrations)
      .set({ ...integrationData, updatedAt: new Date() })
      .where(eq(integrations.id, id))
      .returning();
    return integration;
  }

  async deleteIntegration(id: string): Promise<void> {
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  // Meal operations
  async getMeals(): Promise<Meal[]> {
    return await db.select().from(meals);
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    const [meal] = await db.select().from(meals).where(eq(meals.id, id));
    return meal;
  }

  async createMeal(mealData: InsertMeal): Promise<Meal> {
    const [meal] = await db.insert(meals).values(mealData).returning();
    return meal;
  }

  async updateMeal(id: string, mealData: Partial<InsertMeal>): Promise<Meal> {
    const [meal] = await db
      .update(meals)
      .set({ ...mealData, updatedAt: new Date() })
      .where(eq(meals.id, id))
      .returning();
    return meal;
  }

  async deleteMeal(id: string): Promise<void> {
    await db.delete(meals).where(eq(meals.id, id));
  }

  async incrementMealConsumption(id: string): Promise<Meal> {
    const meal = await this.getMeal(id);
    if (!meal) {
      throw new Error("Meal not found");
    }
    const [updatedMeal] = await db
      .update(meals)
      .set({ 
        consumptionCount: (meal.consumptionCount || 0) + 1,
        updatedAt: new Date()
      })
      .where(eq(meals.id, id))
      .returning();
    return updatedMeal;
  }
}

export const storage = new DatabaseStorage();
