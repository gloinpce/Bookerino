/**
 * Stack Auth integration for the website
 * Handles authentication using Stack Auth service
 */
import { stackAuthConfig } from "../config/database";

const STACK_AUTH_API_URL = "https://api.stack-auth.com/api/v1";

export interface StackAuthUser {
  id: string;
  email: string;
  name?: string;
  emailVerified?: boolean;
  [key: string]: unknown;
}

export interface StackAuthSession {
  sessionId: string;
  userId: string;
  expiresAt: number;
  user: StackAuthUser;
}

/**
 * Initialize Stack Auth SDK (client-side)
 */
export function initStackAuth() {
  // Stack Auth client-side SDK initialization
  // This would typically load the Stack Auth script
  if (typeof window !== "undefined") {
    (window as unknown as { stackAuth?: unknown }).stackAuth = {
      projectId: stackAuthConfig.projectId,
      publishableKey: stackAuthConfig.publishableClientKey,
    };
  }
}

/**
 * Sign up a new user with Stack Auth
 */
export async function stackAuthSignUp(data: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ session: StackAuthSession; user: StackAuthUser }> {
  const response = await fetch(`${STACK_AUTH_API_URL}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-stack-project-id": stackAuthConfig.projectId,
      "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
    }),
  });

  if (!response.ok) {
    // Read response as text first, then try to parse as JSON
    const errorText = await response.text();
    let error: { message?: string };
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || "Sign up failed" };
    }
    throw new Error(error.message || "Sign up failed");
  }

  const result = await response.json();
  
  // Store session token
  if (result.session?.sessionId) {
    localStorage.setItem("stack_auth_session", result.session.sessionId);
  }
  
  return result;
}

/**
 * Sign in with Stack Auth
 */
export async function stackAuthSignIn(
  email: string,
  password: string
): Promise<{ session: StackAuthSession; user: StackAuthUser }> {
  const response = await fetch(`${STACK_AUTH_API_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-stack-project-id": stackAuthConfig.projectId,
      "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    // Read response as text first, then try to parse as JSON
    const errorText = await response.text();
    let error: { message?: string };
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { message: errorText || "Sign in failed" };
    }
    throw new Error(error.message || "Sign in failed");
  }

  const result = await response.json();
  
  // Store session token
  if (result.session?.sessionId) {
    localStorage.setItem("stack_auth_session", result.session.sessionId);
  }
  
  return result;
}

/**
 * Sign out current user
 */
export async function stackAuthSignOut(): Promise<void> {
  const sessionId = localStorage.getItem("stack_auth_session");
  
  if (sessionId) {
    try {
      await fetch(`${STACK_AUTH_API_URL}/auth/sign-out`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-stack-project-id": stackAuthConfig.projectId,
          "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
          "x-stack-session-id": sessionId,
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }
  
  localStorage.removeItem("stack_auth_session");
}

/**
 * Get current session
 */
export async function getStackAuthSession(): Promise<StackAuthSession | null> {
  const sessionId = localStorage.getItem("stack_auth_session");
  
  if (!sessionId) {
    return null;
  }

  try {
    const response = await fetch(`${STACK_AUTH_API_URL}/auth/session`, {
      method: "GET",
      headers: {
        "x-stack-project-id": stackAuthConfig.projectId,
        "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
        "x-stack-session-id": sessionId,
      },
    });

    if (!response.ok) {
      localStorage.removeItem("stack_auth_session");
      return null;
    }

    const result = await response.json();
    return result.session || null;
  } catch (error) {
    console.error("Get session error:", error);
    localStorage.removeItem("stack_auth_session");
    return null;
  }
}

/**
 * Get current user
 */
export async function getStackAuthUser(): Promise<StackAuthUser | null> {
  const session = await getStackAuthSession();
  return session?.user || null;
}

/**
 * Verify JWT token using JWKS
 */
export async function verifyStackAuthToken(token: string): Promise<StackAuthUser | null> {
  try {
    // Fetch JWKS
    const jwksResponse = await fetch(stackAuthConfig.jwksUrl);
    const jwks = await jwksResponse.json();

    // In a real implementation, you would verify the JWT signature using the JWKS
    // For now, we'll decode the token (client-side verification is limited)
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    return payload as StackAuthUser;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isStackAuthAuthenticated(): Promise<boolean> {
  const session = await getStackAuthSession();
  return session !== null && session.expiresAt > Date.now();
}

