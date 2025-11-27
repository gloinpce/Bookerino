import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  urls: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
  },
  apiUrl: "/api/stack",
});
