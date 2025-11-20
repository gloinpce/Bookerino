import { StackClientApp } from "@stackframe/react";
import { stackAuthConfig } from "../config/database";

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
  },
});

