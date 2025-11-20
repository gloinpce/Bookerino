/**
 * API utility functions for the website
 * Uses database configuration for API base URL and settings
 */
import { apiBaseUrl, dbRestApiUrl, debug, jwtSecret } from "../config/database";
import {
  getStackAuthSession,
  stackAuthSignUp,
  stackAuthSignIn,
  stackAuthSignOut,
  getStackAuthUser,
  isStackAuthAuthenticated,
  type StackAuthUser,
} from "./stackAuth";

/**
 * Make an API request to the backend
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${apiBaseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (debug) {
    console.log(`[API Request] ${options.method || "GET"} ${url}`, options);
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add Stack Auth session if available
  const stackSession = await getStackAuthSession();
  if (stackSession?.sessionId) {
    headers["x-stack-session-id"] = stackSession.sessionId;
  }
  
  // Fallback to JWT token if available
  const token = localStorage.getItem("auth_token");
  if (token && !stackSession) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    // Clone the response to read the body without consuming the original
    const responseClone = response.clone();
    const errorText = await responseClone.text().catch(() => response.statusText);
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response;
}

/**
 * GET request helper
 */
export async function apiGet<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: "GET" });
  return response.json();
}

/**
 * POST request helper
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

/**
 * PUT request helper
 */
export async function apiPut<T = unknown>(
  endpoint: string,
  data?: unknown
): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = unknown>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, { method: "DELETE" });
  return response.json();
}

/**
 * Neon REST API helpers (PostgreSQL REST API)
 * These functions work directly with Neon's REST API endpoints
 */
export const neonApi = {
  /**
   * Query a table using Neon REST API
   * @param table - Table name
   * @param options - Query options (select, filter, etc.)
   */
  async query<T = unknown>(
    table: string,
    options: {
      select?: string;
      filter?: Record<string, unknown>;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<T[]> {
    const url = new URL(`${dbRestApiUrl}/${table}`);
    
    if (options.select) {
      url.searchParams.append("select", options.select);
    }
    
    if (options.limit) {
      url.searchParams.append("limit", options.limit.toString());
    }
    
    if (options.offset) {
      url.searchParams.append("offset", options.offset.toString());
    }
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_NEON_API_KEY || "",
    };
    
    // Add Stack Auth session if available
    const stackSession = await getStackAuthSession();
    if (stackSession?.sessionId) {
      headers["x-stack-session-id"] = stackSession.sessionId;
    }
    
    // Fallback to JWT token if available
    const token = localStorage.getItem("auth_token");
    if (token && !stackSession) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (debug) {
      console.log(`[Neon API] GET ${url.toString()}`);
    }
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
    });
    
    if (!response.ok) {
      // Clone the response to read the body without consuming the original
      const responseClone = response.clone();
      const errorText = await responseClone.text().catch(() => response.statusText);
      throw new Error(`Neon API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  },

  /**
   * Insert a record into a table
   */
  async insert<T = unknown>(table: string, data: Record<string, unknown>): Promise<T> {
    const url = `${dbRestApiUrl}/${table}`;
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_NEON_API_KEY || "",
      "Prefer": "return=representation",
    };
    
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (debug) {
      console.log(`[Neon API] POST ${url}`, data);
    }
    
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Clone the response to read the body without consuming the original
      const responseClone = response.clone();
      const errorText = await responseClone.text().catch(() => response.statusText);
      throw new Error(`Neon API Error ${response.status}: ${errorText}`);
    }
    
    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  },

  /**
   * Update records in a table
   */
  async update<T = unknown>(
    table: string,
    filter: Record<string, unknown>,
    data: Record<string, unknown>
  ): Promise<T[]> {
    const url = new URL(`${dbRestApiUrl}/${table}`);
    
    // Build filter query params
    Object.entries(filter).forEach(([key, value]) => {
      url.searchParams.append(key, `eq.${value}`);
    });
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_NEON_API_KEY || "",
      "Prefer": "return=representation",
    };
    
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (debug) {
      console.log(`[Neon API] PATCH ${url.toString()}`, data);
    }
    
    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      // Clone the response to read the body without consuming the original
      const responseClone = response.clone();
      const errorText = await responseClone.text().catch(() => response.statusText);
      throw new Error(`Neon API Error ${response.status}: ${errorText}`);
    }
    
    return response.json();
  },

  /**
   * Delete records from a table
   */
  async delete(table: string, filter: Record<string, unknown>): Promise<void> {
    const url = new URL(`${dbRestApiUrl}/${table}`);
    
    // Build filter query params
    Object.entries(filter).forEach(([key, value]) => {
      url.searchParams.append(key, `eq.${value}`);
    });
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "apikey": import.meta.env.VITE_NEON_API_KEY || "",
    };
    
    const token = localStorage.getItem("auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (debug) {
      console.log(`[Neon API] DELETE ${url.toString()}`);
    }
    
    const response = await fetch(url.toString(), {
      method: "DELETE",
      headers,
    });
    
    if (!response.ok) {
      // Clone the response to read the body without consuming the original
      const responseClone = response.clone();
      const errorText = await responseClone.text().catch(() => response.statusText);
      throw new Error(`Neon API Error ${response.status}: ${errorText}`);
    }
  },
};

/**
 * Authentication helpers
 * Uses Stack Auth for authentication
 */
export const authApi = {
  /**
   * Login user using Stack Auth
   */
  async login(email: string, password: string) {
    const result = await stackAuthSignIn(email, password);
    return {
      user: result.user,
      session: result.session,
    };
  },

  /**
   * Register new user using Stack Auth
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
    businessType?: string;
    businessName?: string;
  }) {
    const result = await stackAuthSignUp({
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
    
    // Store additional business info if needed
    if (userData.businessType || userData.businessName) {
      // You can store this in your database via Neon API
      // await neonApi.insert("user_profiles", { ... });
    }
    
    return {
      user: result.user,
      session: result.session,
    };
  },

  /**
   * Logout user
   */
  async logout() {
    await stackAuthSignOut();
    localStorage.removeItem("auth_token"); // Remove legacy token if exists
  },

  /**
   * Get current user from Stack Auth
   */
  async getCurrentUser(): Promise<StackAuthUser | null> {
    return getStackAuthUser();
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return isStackAuthAuthenticated();
  },
};

