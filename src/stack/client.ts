import { StackClientApp } from "@stackframe/react";

// Stack Auth configuration
// Project ID: 94d1506e-966f-4a6b-a8a6-6be48b783282
// JWKS URL: https://api.stack-auth.com/api/v1/projects/94d1506e-966f-4a6b-a8a6-6be48b783282/.well-known/jwks.json
const projectId = import.meta.env.VITE_STACK_PROJECT_ID || "94d1506e-966f-4a6b-a8a6-6be48b783282";
const publishableClientKey = import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY || "pck_hp7qzx3dmnbatmbz5z6tp6dj6rd3b11j9vybrngm4savg";

export const stackClientApp = new StackClientApp({ 
  tokenStore: "localStorage", 
  projectId,
  publishableClientKey,
  urls: {
    signIn: "/auth",
    signUp: "/auth",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
  },
}); 
