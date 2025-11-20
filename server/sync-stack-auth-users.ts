/**
 * Utility to sync Stack Auth users to Netlify DB
 * This is optional - Stack Auth manages users in its own database
 * Use this if you need to store additional user data in Netlify DB
 */
import { db, isDatabaseAvailable } from "./db";
import { users } from "@shared/schema";
import { stackServerApp } from "./stack";
import { eq } from "drizzle-orm";

/**
 * Sync a Stack Auth user to Netlify DB
 * Call this after a user signs up via Stack Auth
 */
export async function syncStackAuthUserToDatabase(
  stackAuthUserId: string,
  email: string,
  displayName?: string
): Promise<void> {
  if (!isDatabaseAvailable() || !db) {
    console.warn("Database not available. Skipping user sync.");
    return;
  }

  try {
    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, stackAuthUserId));

    if (existingUser) {
      // Update existing user
      await db
        .update(users)
        .set({
          email,
          firstName: displayName?.split(" ")[0] || null,
          lastName: displayName?.split(" ").slice(1).join(" ") || null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, stackAuthUserId));
    } else {
      // Insert new user
      await db.insert(users).values({
        id: stackAuthUserId,
        email,
        firstName: displayName?.split(" ")[0] || null,
        lastName: displayName?.split(" ").slice(1).join(" ") || null,
      });
    }
  } catch (error) {
    console.error("Error syncing Stack Auth user to database:", error);
    // Don't throw - user creation in Stack Auth succeeded
  }
}

/**
 * Sync all Stack Auth users to Netlify DB
 * Useful for initial migration or periodic sync
 */
export async function syncAllStackAuthUsers(): Promise<{
  synced: number;
  errors: number;
}> {
  if (!isDatabaseAvailable() || !db) {
    console.warn("Database not available. Cannot sync users.");
    return { synced: 0, errors: 0 };
  }

  let synced = 0;
  let errors = 0;

  try {
    // List all users from Stack Auth
    const stackUsers = await stackServerApp.listUsers();

    for (const stackUser of stackUsers) {
      try {
        await syncStackAuthUserToDatabase(
          stackUser.id,
          stackUser.primaryEmail || "",
          stackUser.displayName || undefined
        );
        synced++;
      } catch (error) {
        console.error(`Error syncing user ${stackUser.id}:`, error);
        errors++;
      }
    }
  } catch (error) {
    console.error("Error listing Stack Auth users:", error);
    errors++;
  }

  return { synced, errors };
}

