/**
 * Client-side email API utilities
 * These functions call the server-side email API endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function emailApiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("stack_auth_access_token") || localStorage.getItem("auth_token");
  
  const response = await fetch(`${API_BASE_URL}/api/email${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to send email" }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export interface SendEmailParams {
  userIds: string[];
  subject?: string;
  html?: string;
  templateId?: string;
  variables?: Record<string, any>;
  notificationCategoryName?: string;
}

/**
 * Send custom email to users
 */
export async function sendEmail(params: SendEmailParams) {
  return emailApiRequest("/send", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

/**
 * Send welcome email to a new user
 */
export async function sendWelcomeEmail(userId: string, userName?: string) {
  return emailApiRequest("/welcome", {
    method: "POST",
    body: JSON.stringify({ userId, userName }),
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(userId: string, resetUrl: string) {
  return emailApiRequest("/password-reset", {
    method: "POST",
    body: JSON.stringify({ userId, resetUrl }),
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(userId: string, verificationUrl: string) {
  return emailApiRequest("/verify", {
    method: "POST",
    body: JSON.stringify({ userId, verificationUrl }),
  });
}

/**
 * Send trial ending reminder email
 */
export async function sendTrialReminderEmail(userId: string, userName: string, daysRemaining: number) {
  return emailApiRequest("/trial-reminder", {
    method: "POST",
    body: JSON.stringify({ userId, userName, daysRemaining }),
  });
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userId: string,
  userName: string,
  planName: string,
  amount: string
) {
  return emailApiRequest("/subscription-confirmation", {
    method: "POST",
    body: JSON.stringify({ userId, userName, planName, amount }),
  });
}

/**
 * Send feature update email (marketing)
 */
export async function sendFeatureUpdateEmail(
  userIds: string[],
  featureName: string,
  featureDescription: string,
  featureUrl?: string
) {
  return emailApiRequest("/feature-update", {
    method: "POST",
    body: JSON.stringify({ userIds, featureName, featureDescription, featureUrl }),
  });
}

