/**
 * Database configuration for the website
 * Reads from environment variables (VITE_ prefixed for Vite)
 * Falls back to defaults matching .env file values
 */

export const databaseConfig = {
  // Environment
  nodeEnv: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || "development",
  
  // Server port (for API calls)
  port: import.meta.env.VITE_PORT || "3000",
  
  // JWT Secret (for authentication)
  jwtSecret: import.meta.env.VITE_JWT_SECRET || "your-super-secret-key-for-development",
  
  // Debug mode
  debug: import.meta.env.VITE_DEBUG === "true" || import.meta.env.DEV || false,
  
  // JSON Database path
  jsonDbPath: import.meta.env.VITE_JSON_DB_PATH || "./data/db.json",
  
  // Log level
  logLevel: import.meta.env.VITE_LOG_LEVEL || "verbose",
  
  // API Base URL (constructed from port)
  get apiBaseUrl(): string {
    const protocol = this.nodeEnv === "production" ? "https" : "http";
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `${protocol}://${host}:${this.port}`;
  },
  
  // Database connection string (for JSON DB)
  get dbConnectionString(): string {
    return this.jsonDbPath;
  },
} as const;

// Export individual values for convenience
export const {
  nodeEnv,
  port,
  jwtSecret,
  debug,
  jsonDbPath,
  logLevel,
  apiBaseUrl,
  dbConnectionString,
} = databaseConfig;

