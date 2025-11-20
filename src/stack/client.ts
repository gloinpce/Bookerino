import { StackClientApp } from "@stackframe/react";

// Stack Auth configuration
const projectId = import.meta.env.VITE_STACK_PROJECT_ID || "a84c6c76-faaa-49dc-9afc-6ff8e1656eab";
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
