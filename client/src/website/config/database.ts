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
  
  // Neon REST API endpoint
  restApiUrl: import.meta.env.VITE_REST_API_URL || "https://ep-restless-tooth-agrax399.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1",
  
  // PostgreSQL connection string (Neon Database)
  // Database: neondb, Role: neondb_owner
  // IMPORTANT: Never hardcode credentials! Always use environment variables.
  // Set VITE_DATABASE_URL in Netlify Dashboard → Site settings → Environment variables
  databaseUrl: import.meta.env.VITE_DATABASE_URL || "",
  
  // Stack Auth configuration
  stackAuth: {
    projectId: import.meta.env.VITE_STACK_PROJECT_ID || "94d1506e-966f-4a6b-a8a6-6be48b783282",
    publishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "pck_hp7qzx3dmnbatmbz5z6tp6dj6rd3b11j9vybrngm4savg",
    // Note: secretServerKey should only be used server-side, not in client code
    // It's included here for reference but should never be exposed to the client
    secretServerKey: import.meta.env.VITE_STACK_SECRET_SERVER_KEY || "",
    // JWKS URL for token verification - constructed from project ID
    jwksUrl: `https://api.stack-auth.com/api/v1/projects/${import.meta.env.VITE_STACK_PROJECT_ID || "94d1506e-966f-4a6b-a8a6-6be48b783282"}/.well-known/jwks.json`,
    // Anonymous JWKS URL for anonymous token verification
    anonymousJwksUrl: `https://api.stack-auth.com/api/v1/projects/${import.meta.env.VITE_STACK_PROJECT_ID || "94d1506e-966f-4a6b-a8a6-6be48b783282"}/.well-known/jwks.json?include_anonymous=true`,
  },
  
  // API Base URL (constructed from port, fallback to REST API if no port)
  get apiBaseUrl(): string {
    // If REST API URL is set, use it as the base
    if (this.restApiUrl) {
      return this.restApiUrl;
    }
    // Otherwise, construct from port
    const protocol = this.nodeEnv === "production" ? "https" : "http";
    const host = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `${protocol}://${host}:${this.port}`;
  },
  
  // Database connection string (PostgreSQL)
  get dbConnectionString(): string {
    return this.databaseUrl;
  },
  
  // Database REST API URL (Neon PostgreSQL REST API)
  get dbRestApiUrl(): string {
    return this.restApiUrl;
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
  restApiUrl,
  databaseUrl,
  apiBaseUrl,
  dbConnectionString,
  dbRestApiUrl,
} = databaseConfig;

// Export Stack Auth config separately for convenience
export const stackAuthConfig = databaseConfig.stackAuth;

