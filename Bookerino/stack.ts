import "server-only";
import { StackServerApp } from "@stackframe/stack";

export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  secretServerKey: process.env.STACK_SECRET_SERVER_KEY!,
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
  urls: {
    afterSignIn: "/",
    afterSignOut: "/",
    afterSignUp: "/",
  },
});
