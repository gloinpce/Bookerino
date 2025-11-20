# Netlify DB Setup Guide for Bookerino

This guide explains how Netlify DB is configured for automatic database provisioning during builds.

## Database Option Selected

**Option 3: Build-time Auto-Provisioning** ✅

This is the best option because:
- ✅ Automated - database is created automatically during builds
- ✅ Recommended for code agents and automated workflows
- ✅ No manual setup required
- ✅ Automatically connects to Netlify functions and environment variables
- ✅ Powered by Neon (production-grade PostgreSQL)

## How It Works

1. **Package Installation**: `@netlify/neon` package is installed in `package.json`
2. **Automatic Provisioning**: When you run `netlify dev`, `netlify build`, or push to Git, Netlify automatically:
   - Creates a Neon database instance (if not already created)
   - Sets up required environment variables (`DATABASE_URL`, `NETLIFY_DATABASE_URL`)
   - Connects the database to your Netlify project

## Stack Auth Integration

**Important**: Stack Auth manages user accounts in its own database. Netlify DB is used for:
- Storing application-specific data (bookings, rooms, reviews, etc.)
- Syncing Stack Auth user data to your database (optional)
- Storing additional user metadata

## Environment Variables

Netlify DB automatically sets these environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NETLIFY_DATABASE_URL` - Netlify-specific database URL

These are available in:
- Netlify Functions
- Build environment
- Server-side code

## Database Schema

The database uses Drizzle ORM with the following tables (from `shared/schema.ts`):

- `users` - User accounts (can sync with Stack Auth)
- `sessions` - Session storage
- `rooms` - Room management
- `bookings` - Booking records
- `reviews` - Guest reviews
- `integrations` - Third-party integrations
- `meals` - Meal management

## Account Creation Flow

### Stack Auth Handles User Accounts

When users sign up via `/auth`:
1. Stack Auth creates the user account in its database
2. User receives authentication tokens
3. User can sign in and access the application

### Optional: Sync to Netlify DB

If you want to store user data in Netlify DB as well:

```typescript
// After Stack Auth sign-up, sync to Netlify DB
import { db } from "./db";
import { users } from "@shared/schema";

async function syncStackAuthUserToDatabase(stackAuthUserId: string, email: string, displayName?: string) {
  await db.insert(users).values({
    id: stackAuthUserId,
    email,
    firstName: displayName?.split(' ')[0],
    lastName: displayName?.split(' ').slice(1).join(' '),
  }).onConflictDoNothing();
}
```

## Setup Steps

### 1. Package Already Installed ✅

The `@netlify/neon` package is already added to `package.json`.

### 2. First Build/Deploy

When you next build or deploy:
- Run `netlify dev` locally, OR
- Push to Git (triggers Netlify build), OR
- Run `netlify build`

Netlify will automatically:
- Create the database instance
- Set environment variables
- Connect everything

### 3. Claim Your Database (Important!)

**⚠️ CRITICAL**: You must claim your database within 7 days, or it will be deleted!

1. Go to Netlify Dashboard → Your Site → **Extensions**
2. Find **Neon database** extension
3. Click **Connect Neon** and authorize
4. Click **Claim database**

After claiming:
- Database persists beyond 7 days
- Full production capacity unlocked
- Database monitoring available
- Can upgrade Neon features

## Usage in Code

### Server-Side (Netlify Functions)

```typescript
// Environment variables are automatically available
const databaseUrl = process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
```

### Database Connection

```typescript
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.NETLIFY_DATABASE_URL,
});

export const db = drizzle(pool);
```

## Migration

Run migrations to set up database schema:

```bash
# Using Drizzle
npm run db:migrate  # If you have this script
# Or manually using drizzle-kit
npx drizzle-kit push
```

## Testing Account Creation

### Via Stack Auth (Primary Method)

1. Go to `https://bookerino.net/auth`
2. Click "Înregistrare" (Sign Up)
3. Fill in name, email, password
4. Click "Începeți perioada de probă"
5. Account is created in Stack Auth database ✅

### Verify Account Creation

- User can sign in immediately after sign-up
- User appears in Stack Auth dashboard
- User can access protected routes (`/profile`)

## Troubleshooting

### Database Not Created

- Ensure `@netlify/neon` is in `package.json` dependencies
- Run `netlify dev` or trigger a build
- Check Netlify build logs for database creation messages

### Environment Variables Missing

- Variables are set automatically during build
- Check Netlify Dashboard → Site settings → Environment variables
- Ensure `DATABASE_URL` or `NETLIFY_DATABASE_URL` is present

### Account Creation Fails

- Stack Auth handles account creation - check Stack Auth dashboard
- Verify Stack Auth is configured correctly (Project ID, keys)
- Check browser console for errors
- Verify OAuth/email providers are configured

## Next Steps

1. **Deploy to Netlify** - Database will be created automatically
2. **Claim Database** - Within 7 days to prevent deletion
3. **Test Account Creation** - Use `/auth` page to create accounts
4. **Monitor Database** - Use Neon console for monitoring

## Additional Resources

- [Netlify DB Documentation](https://docs.netlify.com/databases/overview/)
- [Neon Documentation](https://neon.tech/docs)
- [Stack Auth Documentation](https://docs.stack-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

