# Database Configuration Usage Guide

This guide explains where and how to use the database configuration in the website.

## Import the Configuration

```typescript
// Import the entire config object
import { databaseConfig } from "../config/database";

// Or import specific values
import { apiBaseUrl, jsonDbPath, jwtSecret, debug } from "../config/database";
```

## Where to Use It

### 1. **API Calls** (`client/src/website/lib/api.ts`)

The database configuration is used in API utility functions:

```typescript
import { apiBaseUrl, debug } from "../config/database";

// Use apiBaseUrl for making API requests
const response = await fetch(`${apiBaseUrl}/api/endpoint`);
```

### 2. **Authentication** (`client/src/website/pages/Auth.tsx`)

Use the API utilities that already use the database config:

```typescript
import { authApi } from "../lib/api";

// Login
await authApi.login(email, password);

// Register
await authApi.register({ name, email, password });
```

### 3. **Form Submissions**

When submitting forms that need to save data:

```typescript
import { apiPost } from "../lib/api";
import { jsonDbPath } from "../config/database";

// Example: Save form data
const saveData = async (formData) => {
  await apiPost("/api/data", formData);
};
```

### 4. **Debugging**

Use the debug flag for conditional logging:

```typescript
import { debug } from "../config/database";

if (debug) {
  console.log("Debug info:", data);
}
```

### 5. **Environment-Specific Behavior**

Use nodeEnv for conditional logic:

```typescript
import { nodeEnv } from "../config/database";

if (nodeEnv === "production") {
  // Production-specific code
}
```

## Available Configuration Values

- `apiBaseUrl` - Base URL for API calls (e.g., "http://localhost:3000")
- `jsonDbPath` - Path to JSON database file (e.g., "./data/db.json")
- `jwtSecret` - JWT secret for authentication
- `port` - Server port (e.g., "3000")
- `nodeEnv` - Environment mode ("development" or "production")
- `debug` - Debug mode flag (boolean)
- `logLevel` - Logging level ("verbose", etc.)
- `dbConnectionString` - Database connection string

## Example: Complete Component Usage

```typescript
import { useState } from "react";
import { authApi } from "../lib/api";
import { apiBaseUrl, debug } from "../config/database";

const MyComponent = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      if (debug) {
        console.log("Submitting to:", apiBaseUrl);
      }
      
      const result = await authApi.register(data);
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
};
```

## Neon REST API Integration

The configuration includes support for Neon PostgreSQL REST API:

```typescript
import { neonApi } from "../lib/api";

// Query a table
const users = await neonApi.query("users", { limit: 10 });

// Insert a record
const newUser = await neonApi.insert("users", { name: "John", email: "john@example.com" });

// Update records
await neonApi.update("users", { id: 1 }, { name: "Jane" });

// Delete records
await neonApi.delete("users", { id: 1 });
```

## Stack Auth Integration

The website uses Stack Auth for authentication:

```typescript
import { authApi } from "../lib/api";

// Sign up
await authApi.register({ name: "John", email: "john@example.com", password: "password" });

// Sign in
await authApi.login("john@example.com", "password");

// Get current user
const user = await authApi.getCurrentUser();

// Check authentication
const isAuth = await authApi.isAuthenticated();

// Sign out
await authApi.logout();
```

## Environment Variables

The configuration reads from environment variables in `client/.env`:

```env
VITE_NODE_ENV=development
VITE_PORT=3000
VITE_JWT_SECRET=your-super-secret-key-for-development
VITE_DEBUG=true
VITE_JSON_DB_PATH=./data/db.json
VITE_LOG_LEVEL=verbose

# Neon REST API endpoint
VITE_REST_API_URL=https://ep-restless-tooth-agrax399.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1

# PostgreSQL connection string (Neon Database)
VITE_DATABASE_URL=postgresql://neondb_owner:npg_RrQlv81uSYkb@ep-restless-tooth-agrax399-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Stack Auth configuration
VITE_STACK_PROJECT_ID=a84c6c76-faaa-49dc-9afc-6ff8e1656eab
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pck_2pfmrsp33j9rm2nbzyjhtky9k99368t0tgdq2b1nvb4cg
VITE_STACK_SECRET_SERVER_KEY=ssk_k945n3dndhc27ntzbd8cx7t8adpzjnk70katsbrtn82v8

# Neon API Key (for REST API authentication)
VITE_NEON_API_KEY=your-neon-api-key-here
```

Note: In Vite, environment variables must be prefixed with `VITE_` to be accessible in client code.

**Important**: 
- Stack Auth credentials are already configured
- Add your Neon API key to `VITE_NEON_API_KEY` in the `.env` file for REST API authentication

