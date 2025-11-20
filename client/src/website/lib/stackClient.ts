import { StackClientApp } from "@stackframe/react";
import { stackAuthConfig, nodeEnv } from "../config/database";
import { isProduction, logProductionStatus } from "./production";

// Validate production configuration on module load
if (typeof window !== "undefined" && isProduction) {
  logProductionStatus();
}

/**
 * Stack Auth Client App configuration
 * Configured for production use with proper domain settings
 */
export const stackClientApp = new StackClientApp({ 
  tokenStore: "localStorage", 
  projectId: stackAuthConfig.projectId,
  publishableClientKey: stackAuthConfig.publishableClientKey,
  urls: {
    signIn: "/auth",
    signUp: "/auth",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
    oauthCallback: typeof window !== "undefined" ? window.location.origin + "/oauth" : "/oauth",
  },
  // Production-specific settings
  ...(isProduction && {
    // In production, ensure secure token storage
    // localStorage is already secure when using HTTPS
  }),
  // OAuth configuration
  // Account merging strategy is configured server-side
  // OAuth scopes can be requested during sign-in (configured server-side)
});

