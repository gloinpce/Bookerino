/**
 * Stack Auth Server App Configuration
 * Used for server-side email sending and user management
 */
import { StackServerApp } from "@stackframe/stack";

// Stack Auth configuration from environment variables
const projectId = process.env.STACK_PROJECT_ID || "94d1506e-966f-4a6b-a8a6-6be48b783282";
const secretServerKey = process.env.STACK_SECRET_SERVER_KEY || "";

if (!secretServerKey) {
  console.warn("⚠️ STACK_SECRET_SERVER_KEY not set. Email functionality will be limited.");
}

/**
 * Stack Server App instance for server-side operations
 * Used for sending emails and server-side user management
 */
export const stackServerApp = new StackServerApp({
  projectId,
  secretServerKey,
  urls: {
    signIn: "/auth",
    signUp: "/auth",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
  },
  // OAuth account merging strategy: "link" (default)
  // Links OAuth accounts to existing accounts with the same email
  // Requires both credentials to be verified
  oauthAccountMergingStrategy: "link",
  // Optional: Request OAuth scopes during sign-in to avoid showing authorization page twice
  // Uncomment and configure as needed:
  // oauthScopesOnSignIn: {
  //   google: [
  //     "https://www.googleapis.com/auth/userinfo.email",
  //     "https://www.googleapis.com/auth/userinfo.profile",
  //   ],
  // },
});

