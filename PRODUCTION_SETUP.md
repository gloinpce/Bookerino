# Production Setup Guide for Bookerino

This guide outlines the steps required to prepare Bookerino for production deployment with Stack Auth.

## Prerequisites

Before deploying to production, ensure you have:
- A production domain (e.g., `https://bookerino.net`)
- Access to Stack Auth dashboard
- OAuth provider accounts (if using OAuth sign-in)
- SMTP email server (for production emails)

## Production Checklist

### 1. Configure Domains in Stack Dashboard

**Why:** By default, Stack allows all localhost paths as valid callback URLs. In production, this is a security risk.

**Steps:**
1. Navigate to [Stack Auth Dashboard](https://app.stack-auth.com/projects)
2. Go to the **"Domain & Handlers"** tab
3. Add your production domain: `https://bookerino.net`
4. **Important:** Disable the **"Allow all localhost callbacks for development"** option
5. Save changes

**Callback URLs to configure:**
- `https://bookerino.net/auth` (sign-in/sign-up)
- `https://bookerino.net` (after sign-in redirect)

### 2. Configure OAuth Providers (Optional)

**Why:** Stack uses shared OAuth keys for development, which display "Stack Development" on consent screens. For production, you need your own OAuth keys.

**Steps for each provider (Google, GitHub, etc.):**

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 Client ID
3. Set authorized redirect URI to:
   ```
   https://api.stack-auth.com/api/v1/auth/oauth/callback/google
   ```
4. Copy Client ID and Client Secret
5. In Stack dashboard → **"Auth Methods"** → **"Google"**
6. Switch from "Shared keys" to "Custom keys"
7. Enter your Client ID and Client Secret

#### GitHub OAuth
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL to:
   ```
   https://api.stack-auth.com/api/v1/auth/oauth/callback/github
   ```
4. Copy Client ID and Client Secret
5. In Stack dashboard → **"Auth Methods"** → **"GitHub"**
6. Switch from "Shared keys" to "Custom keys"
7. Enter your Client ID and Client Secret

**Repeat for other providers as needed:**
- Facebook: `https://api.stack-auth.com/api/v1/auth/oauth/callback/facebook`
- Microsoft: `https://api.stack-auth.com/api/v1/auth/oauth/callback/microsoft`
- Spotify: `https://api.stack-auth.com/api/v1/auth/oauth/callback/spotify`
- GitLab: `https://api.stack-auth.com/api/v1/auth/oauth/callback/gitlab`
- Bitbucket: `https://api.stack-auth.com/api/v1/auth/oauth/callback/bitbucket`
- LinkedIn: `https://api.stack-auth.com/api/v1/auth/oauth/callback/linkedin`
- X (Twitter): `https://api.stack-auth.com/api/v1/auth/oauth/callback/x`

### 3. Configure Email Server

**Why:** Stack uses a shared email server for development, which sends emails from Stack's domain. Users may not trust emails from an unfamiliar domain.

**Steps:**
1. Set up your own SMTP email server and connect it to your domain
   - This step is outside Stack's scope - configure with your email provider
   - Common providers: SendGrid, Mailgun, AWS SES, etc.
2. In Stack dashboard → **"Emails"** section
3. Click **"Edit"** in the **"Email Server"** section
4. Switch from **"Shared"** to **"Custom SMTP server"**
5. Enter your SMTP configuration:
   - SMTP Host
   - SMTP Port (usually 587 for TLS or 465 for SSL)
   - SMTP Username
   - SMTP Password
   - From Email Address (e.g., `noreply@bookerino.net`)
6. Test email sending and save

### 4. Environment Variables

Ensure the following environment variables are set in your production environment (Netlify):

**Required:**
```env
VITE_STACK_PROJECT_ID=your-production-project-id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=your-production-publishable-key
VITE_NODE_ENV=production
```

**Optional but recommended:**
```env
VITE_DATABASE_URL=your-production-database-url
VITE_REST_API_URL=your-production-rest-api-url
VITE_JWT_SECRET=your-secure-jwt-secret
```

**Setting in Netlify:**
1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add each variable with production values
3. Redeploy after adding variables

### 5. Enable Production Mode

**Final Step:**
1. Navigate to Stack dashboard → **"Project Settings"** tab
2. Enable **"Production Mode"**
3. Verify all configurations are correct
4. Test sign-up and sign-in flows on production domain

## Security Checklist

- ✅ Domain configured in Stack dashboard
- ✅ Localhost callbacks disabled
- ✅ OAuth providers configured with custom keys (if using OAuth)
- ✅ Custom SMTP server configured
- ✅ Production environment variables set
- ✅ Production mode enabled in Stack dashboard
- ✅ HTTPS enabled on production domain
- ✅ Secure JWT secret set (not default value)

## Testing Production Setup

After completing all steps, test:

1. **Sign-up flow:**
   - Visit `https://bookerino.net/auth`
   - Create a new account
   - Verify email is received from your domain (not Stack's domain)

2. **Sign-in flow:**
   - Sign in with email/password
   - Verify redirect works correctly

3. **OAuth flow (if configured):**
   - Try "Sign in with Google/GitHub"
   - Verify consent screen shows your app name (not "Stack Development")
   - Complete OAuth flow

4. **Protected routes:**
   - Try accessing `/profile` without signing in
   - Verify redirect to `/auth` works

## Troubleshooting

### Emails not sending
- Check SMTP configuration in Stack dashboard
- Verify email server credentials are correct
- Check spam folder

### OAuth not working
- Verify callback URLs match exactly
- Check OAuth app settings on provider's website
- Ensure custom keys are entered correctly in Stack dashboard

### Domain errors
- Verify domain is added in Stack dashboard
- Check domain format (must include `https://`)
- Ensure localhost callbacks are disabled

## Additional Resources

- [Stack Auth Production Documentation](https://docs.stack-auth.com/docs/getting-started/production)
- [Stack Auth Dashboard](https://app.stack-auth.com/projects)
- [Stack Auth API Documentation](https://docs.stack-auth.com/api/overview)

