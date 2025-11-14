# Where to Use Database Configuration

## Summary

The database configuration is used in the following places:

### 1. **API Utility Functions** (`lib/api.ts`)
   - **Purpose**: All API calls use `apiBaseUrl` from the config
   - **Usage**: Automatically constructs API URLs using the configured port and environment
   - **Example**: `apiRequest()` uses `apiBaseUrl` to make requests

### 2. **Authentication** (`pages/Auth.tsx`)
   - **Purpose**: Login and registration forms use the API utilities
   - **Usage**: Uses `authApi` which internally uses the database config
   - **Example**: `authApi.login()` and `authApi.register()` use the config

### 3. **Debug Logging**
   - **Purpose**: Conditional logging based on debug mode
   - **Usage**: Import `debug` flag to enable/disable console logs
   - **Example**: `if (debug) console.log(...)`

### 4. **Environment-Specific Behavior**
   - **Purpose**: Different behavior for development vs production
   - **Usage**: Use `nodeEnv` to check current environment
   - **Example**: `if (nodeEnv === "production") { ... }`

## Quick Reference

```typescript
// Import the config
import { databaseConfig, apiBaseUrl, dbRestApiUrl, debug, jwtSecret } from "../config/database";

// Use the API utilities (recommended)
import { authApi, apiGet, apiPost, neonApi } from "../lib/api";

// Neon REST API examples
const users = await neonApi.query("users");
const newUser = await neonApi.insert("users", { name: "John" });
```

## Files That Use Database Config

1. ✅ `lib/api.ts` - Uses `apiBaseUrl`, `dbRestApiUrl`, and `debug`
2. ✅ `pages/Auth.tsx` - Uses `authApi` (which uses the config)
3. ✅ `lib/api.ts` - Includes `neonApi` for direct Neon REST API access
4. 📝 Any component that makes API calls should use `lib/api.ts`

## Neon REST API

The Neon REST API endpoint is configured and ready to use:
- **Endpoint**: `https://ep-restless-tooth-agrax399.apirest.c-2.eu-central-1.aws.neon.tech/neondb/rest/v1`
- **Access via**: `neonApi.query()`, `neonApi.insert()`, `neonApi.update()`, `neonApi.delete()`
- **API Key**: Set `VITE_NEON_API_KEY` in `.env` file

## Next Steps

When you need to:
- **Make API calls**: Use functions from `lib/api.ts`
- **Authenticate users**: Use `authApi` from `lib/api.ts`
- **Check environment**: Import `nodeEnv` from `config/database`
- **Enable debug logs**: Import `debug` from `config/database`

