/**
 * Database connection for Netlify DB (Neon)
 * Automatically uses NETLIFY_DATABASE_URL or DATABASE_URL from Netlify environment
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

// Netlify DB automatically provides these environment variables:
// - NETLIFY_DATABASE_URL (preferred for Netlify DB)
// - DATABASE_URL (fallback)
const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn(
    "⚠️ DATABASE_URL not set. Netlify DB will create it automatically on first build.\n" +
    "If running locally, use 'netlify dev' or set DATABASE_URL manually."
  );
}

// Create connection pool
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })
  : null;

// Create Drizzle instance
export const db = pool ? drizzle(pool, { schema }) : null;

// Export pool for direct access if needed
export { pool };

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return db !== null && pool !== null;
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  if (!pool) {
    return false;
  }

  try {
    const client = await pool.connect();
    client.release();
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

