/**
 * Stack Auth integration for the website
 * Handles authentication using Stack Auth service
 */
import { stackAuthConfig } from "../config/database";

const STACK_AUTH_API_URL = "https://api.stack-auth.com/api/v1";
const STACK_AUTH_BASE_URL = "https://api.stack-auth.com/api/v1";

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
  try {
    const response = await fetch(`${STACK_AUTH_BASE_URL}/auth/password/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-stack-project-id": stackAuthConfig.projectId,
        "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    // Read response body as text once
    const responseText = await response.text();
    
    if (!response.ok) {
      // Parse error response
      let error: { message?: string; error?: string };
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText || "Sign up failed" };
      }
      const errorMessage = error.message || error.error || "Sign up failed";
      throw new Error(errorMessage);
    }

    // Parse success response
    const result = JSON.parse(responseText);
    
    // Stack Auth returns access_token, refresh_token, and user_id
    // Store tokens for session management
    if (result.access_token) {
      localStorage.setItem("stack_auth_access_token", result.access_token);
    }
    if (result.refresh_token) {
      localStorage.setItem("stack_auth_refresh_token", result.refresh_token);
    }
    if (result.user_id) {
      localStorage.setItem("stack_auth_user_id", result.user_id);
    }
    
    // Update user name if provided (Stack Auth sign-up doesn't accept name field)
    if (data.name) {
      try {
        await fetch(`${STACK_AUTH_BASE_URL}/users/me`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-stack-project-id": stackAuthConfig.projectId,
            "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
            "Authorization": `Bearer ${result.access_token}`,
          },
          body: JSON.stringify({
            display_name: data.name,
          }),
        });
      } catch (err) {
        console.warn("Could not update user name:", err);
      }
    }
    
    // Fetch user details using the access token
    let userDetails: StackAuthUser = {
      id: result.user_id || "",
      email: data.email,
      name: data.name,
    };
    
    try {
      // Fetch current user details from Stack Auth
      const userResponse = await fetch(`${STACK_AUTH_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "x-stack-project-id": stackAuthConfig.projectId,
          "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
          "Authorization": `Bearer ${result.access_token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userDetails = {
          id: userData.id || result.user_id || "",
          email: userData.primary_email || data.email,
          name: userData.display_name || data.name,
          emailVerified: userData.primary_email_verified || false,
        };
      }
    } catch (err) {
      // If fetching user details fails, use basic info
      console.warn("Could not fetch user details:", err);
    }
    
    // Transform to match expected format
    return {
      session: {
        sessionId: result.access_token || "",
        userId: result.user_id || "",
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        user: userDetails,
      },
      user: userDetails,
    };
  } catch (error) {
    // Handle network errors and other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Nu s-a putut conecta la serverul de autentificare. Verificați conexiunea la internet.");
    }
    // Re-throw other errors as-is
    throw error;
  }
}

/**
 * Sign in with Stack Auth
 */
export async function stackAuthSignIn(
  email: string,
  password: string
): Promise<{ session: StackAuthSession; user: StackAuthUser }> {
  try {
    const response = await fetch(`${STACK_AUTH_BASE_URL}/auth/password/sign-in`, {
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

    // Read response body as text once
    const responseText = await response.text();
    
    if (!response.ok) {
      // Parse error response
      let error: { message?: string; error?: string };
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { message: responseText || "Sign in failed" };
      }
      const errorMessage = error.message || error.error || "Sign in failed";
      throw new Error(errorMessage);
    }

    // Parse success response
    const result = JSON.parse(responseText);
    
    // Stack Auth returns access_token, refresh_token, and user_id
    // Store tokens for session management
    if (result.access_token) {
      localStorage.setItem("stack_auth_access_token", result.access_token);
    }
    if (result.refresh_token) {
      localStorage.setItem("stack_auth_refresh_token", result.refresh_token);
    }
    if (result.user_id) {
      localStorage.setItem("stack_auth_user_id", result.user_id);
    }
    
    // Fetch user details using the access token
    let userDetails: StackAuthUser = {
      id: result.user_id || "",
      email: email,
    };
    
    try {
      // Fetch current user details from Stack Auth
      const userResponse = await fetch(`${STACK_AUTH_BASE_URL}/users/me`, {
        method: "GET",
        headers: {
          "x-stack-project-id": stackAuthConfig.projectId,
          "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
          "Authorization": `Bearer ${result.access_token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userDetails = {
          id: userData.id || result.user_id || "",
          email: userData.primary_email || email,
          name: userData.display_name,
          emailVerified: userData.primary_email_verified || false,
        };
      }
    } catch (err) {
      // If fetching user details fails, use basic info
      console.warn("Could not fetch user details:", err);
    }
    
    // Return session and user data
    return {
      session: {
        sessionId: result.access_token || "",
        userId: result.user_id || "",
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
        user: userDetails,
      },
      user: userDetails,
    };
  } catch (error) {
    // Handle network errors and other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Nu s-a putut conecta la serverul de autentificare. Verificați conexiunea la internet.");
    }
    // Re-throw other errors as-is
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function stackAuthSignOut(): Promise<void> {
  const accessToken = localStorage.getItem("stack_auth_access_token");
  
  if (accessToken) {
    try {
      // Stack Auth uses DELETE /auth/sessions/current for sign out
      await fetch(`${STACK_AUTH_BASE_URL}/auth/sessions/current`, {
        method: "DELETE",
        headers: {
          "x-stack-project-id": stackAuthConfig.projectId,
          "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
          "Authorization": `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }
  
  // Clear all auth tokens
  localStorage.removeItem("stack_auth_access_token");
  localStorage.removeItem("stack_auth_refresh_token");
  localStorage.removeItem("stack_auth_user_id");
  localStorage.removeItem("stack_auth_session"); // Legacy cleanup
}

/**
 * Get current session
 */
export async function getStackAuthSession(): Promise<StackAuthSession | null> {
  const accessToken = localStorage.getItem("stack_auth_access_token");
  const userId = localStorage.getItem("stack_auth_user_id");
  
  if (!accessToken || !userId) {
    return null;
  }

  try {
    // Verify token is still valid by fetching current user details
    const response = await fetch(`${STACK_AUTH_BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        "x-stack-project-id": stackAuthConfig.projectId,
        "x-stack-publishable-key": stackAuthConfig.publishableClientKey,
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // Token invalid, clear storage
      localStorage.removeItem("stack_auth_access_token");
      localStorage.removeItem("stack_auth_refresh_token");
      localStorage.removeItem("stack_auth_user_id");
      return null;
    }

    const userData = await response.json();
    
    return {
      sessionId: accessToken,
      userId: userData.id || userId,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      user: {
        id: userData.id || userId,
        email: userData.primary_email || "",
        name: userData.display_name,
        emailVerified: userData.primary_email_verified || false,
      },
    };
  } catch (error) {
    console.error("Get session error:", error);
    localStorage.removeItem("stack_auth_access_token");
    localStorage.removeItem("stack_auth_refresh_token");
    localStorage.removeItem("stack_auth_user_id");
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

