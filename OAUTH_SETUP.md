# OAuth Setup Guide for Bookerino

This guide explains how to configure and use OAuth authentication with Stack Auth for Bookerino.

## OAuth Configuration

### Current Setup

- **OAuth Callback URL**: `https://bookerino.net/oauth` (production) or `http://localhost:5173/oauth` (development)
- **Account Merging Strategy**: `link` (default)
  - Links OAuth accounts to existing accounts with the same email
  - Requires both credentials to be verified
  - Prevents duplicate accounts

### Supported Providers

Currently configured:
- **Google** - Available and tested

Future providers (can be added):
- GitHub
- Facebook
- Microsoft
- Spotify
- GitLab
- Bitbucket
- LinkedIn
- X (Twitter)

## Stack Auth Dashboard Configuration

### 1. Configure OAuth Providers

For each OAuth provider you want to use:

1. **Navigate to Stack Auth Dashboard**
   - Go to [Stack Auth Dashboard](https://app.stack-auth.com/projects)
   - Select your project (Project ID: `94d1506e-966f-4a6b-a8a6-6be48b783282`)

2. **Go to Auth Methods**
   - Click on **"Auth Methods"** in the sidebar
   - Select the provider you want to configure (e.g., Google)

3. **Set Up OAuth App**
   - **For Google:**
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new OAuth 2.0 Client ID
     - Set authorized redirect URI to:
       ```
       https://api.stack-auth.com/api/v1/auth/oauth/callback/google
       ```
     - Copy Client ID and Client Secret
   
   - **For GitHub:**
     - Go to GitHub Settings → Developer settings → OAuth Apps
     - Create a new OAuth App
     - Set Authorization callback URL to:
       ```
       https://api.stack-auth.com/api/v1/auth/oauth/callback/github
       ```
     - Copy Client ID and Client Secret

4. **Configure in Stack Dashboard**
   - Switch from "Shared keys" to "Custom keys"
   - Enter your Client ID and Client Secret
   - Save configuration

### 2. Configure OAuth Account Merging Strategy

The account merging strategy is configured in `server/stack.ts`:

```typescript
oauthAccountMergingStrategy: "link" // Options: "link" | "allow" | "block"
```

**Strategies:**
- **`link`** (default): Links OAuth accounts to existing accounts with the same email. Requires verification.
- **`allow`**: Creates separate accounts even if email matches (legacy behavior).
- **`block`**: Prevents sign-in if account with same email exists.

### 3. Configure OAuth Scopes (Optional)

If you need access to provider APIs (e.g., Google Drive, GitHub repos), configure scopes in `server/stack.ts`:

```typescript
oauthScopesOnSignIn: {
  google: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/drive.readonly", // Example: Google Drive access
  ],
}
```

**Note**: Requesting scopes during sign-in avoids showing the authorization page twice.

## OAuth Flow

### Sign-In Flow

1. User clicks "Sign in with Google" button
2. User is redirected to Google's authorization page
3. User grants permissions
4. Google redirects to `/oauth` with authorization code
5. Stack Auth exchanges code for access token
6. User is signed in and redirected to home page

### Error Handling

The implementation handles various error scenarios:

- **User denies authorization**: Shows friendly error message
- **Network errors**: Detects and shows connection error
- **Account merging conflicts**: Explains duplicate account situation
- **Missing parameters**: Validates OAuth callback parameters
- **Provider errors**: Displays provider-specific error messages

## Code Structure

### Client-Side (`client/src/website/pages/Auth.tsx`)

- OAuth button with error handling
- OAuth callback handler with comprehensive error checking
- Loading states and user feedback
- URL cleanup after OAuth callback

### Server-Side (`server/stack.ts`)

- OAuth account merging strategy configuration
- OAuth scopes configuration (optional)
- Server-side OAuth settings

### Error Boundary (`client/src/website/components/OAuthErrorBoundary.tsx`)

- Catches unhandled OAuth errors
- Provides fallback UI
- Allows retry functionality

## Testing OAuth

### Development Testing

1. Start development server: `npm run dev`
2. Navigate to `/auth`
3. Click "OAuth" tab
4. Click "Sign in with Google"
5. Complete OAuth flow
6. Verify redirect to home page

### Production Testing

1. Ensure OAuth provider is configured in Stack dashboard
2. Test on production domain: `https://bookerino.net/auth`
3. Verify callback URL matches Stack Auth configuration
4. Test error scenarios:
   - User denies authorization
   - Network interruption
   - Invalid callback parameters

## Troubleshooting

### OAuth Not Working

**Issue**: OAuth button doesn't redirect
- **Solution**: Check browser console for errors
- Verify `oauthCallback` URL is correct in `stackClient.ts`
- Ensure OAuth provider is configured in Stack dashboard

**Issue**: "Invalid redirect URI" error
- **Solution**: Verify callback URL in OAuth provider settings matches:
  ```
  https://api.stack-auth.com/api/v1/auth/oauth/callback/{provider}
  ```

**Issue**: "Account already exists" error
- **Solution**: This is expected with "link" strategy. User should sign in with email/password first, then link OAuth account.

### Callback Errors

**Issue**: Stuck on `/oauth` page
- **Solution**: Check browser console for errors
- Verify OAuth provider returned valid code and state
- Check network tab for API call failures

**Issue**: "Missing code or state" error
- **Solution**: OAuth provider may have returned error instead of code
- Check URL parameters for `error` parameter
- User may have denied authorization

### Account Merging Issues

**Issue**: Duplicate accounts created
- **Solution**: Ensure `oauthAccountMergingStrategy` is set to "link" (not "allow")
- Verify email addresses match exactly
- Check that both accounts have verified emails

## Best Practices

1. **Always handle errors**: OAuth can fail for various reasons
2. **Provide clear feedback**: Show user-friendly error messages
3. **Clean URLs**: Remove OAuth parameters after processing
4. **Test thoroughly**: Test all error scenarios
5. **Monitor logs**: Check server logs for OAuth-related errors
6. **Use error boundary**: Catch unexpected OAuth errors

## Security Considerations

1. **Never expose OAuth secrets**: Keep Client Secrets server-side only
2. **Validate callbacks**: Always verify OAuth callback parameters
3. **Use HTTPS**: OAuth requires HTTPS in production
4. **Handle state parameter**: Stack Auth handles state validation automatically
5. **Account verification**: "Link" strategy requires verified emails

## Additional Resources

- [Stack Auth OAuth Documentation](https://docs.stack-auth.com/docs/apps/oauth)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Stack Auth Dashboard](https://app.stack-auth.com/projects)

