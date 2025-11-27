import { stackServerApp } from "../../../../stack";
import { StackHandler } from "@stackframe/stack";

export const { GET, POST } = StackHandler(stackServerApp);
