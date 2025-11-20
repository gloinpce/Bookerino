/**
 * Production configuration and validation for Stack Auth
 * Ensures all production requirements are met before deployment
 */

import { databaseConfig } from "../config/database";

export const isProduction = databaseConfig.nodeEnv === "production";

/**
 * Validates that all required production environment variables are set
 */
export function validateProductionConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isProduction) {
    return { isValid: true, errors: [], warnings: [] };
  }

  // Required Stack Auth configuration
  if (!databaseConfig.stackAuth.projectId) {
    errors.push("VITE_STACK_PROJECT_ID is required in production");
  }

  if (!databaseConfig.stackAuth.publishableClientKey) {
    errors.push("VITE_STACK_PUBLISHABLE_CLIENT_KEY is required in production");
  }

  // Check if using default/development values (warnings)
  if (
    databaseConfig.stackAuth.projectId ===
    "94d1506e-966f-4a6b-a8a6-6be48b783282"
  ) {
    // This is now the production project ID, so no warning needed
    // Only warn if it's an old/unknown project ID
  }

  if (
    databaseConfig.stackAuth.publishableClientKey ===
    "pck_hp7qzx3dmnbatmbz5z6tp6dj6rd3b11j9vybrngm4savg"
  ) {
    warnings.push(
      "Using default Stack Auth publishable key. Ensure this is your production key."
    );
  }

  // Check for development secrets in production
  if (
    databaseConfig.jwtSecret === "your-super-secret-key-for-development"
  ) {
    errors.push(
      "Default JWT secret detected in production. Set VITE_JWT_SECRET to a secure value."
    );
  }

  // Validate domain configuration
  if (typeof window !== "undefined") {
    const currentDomain = window.location.hostname;
    if (currentDomain === "localhost" || currentDomain === "127.0.0.1") {
      warnings.push(
        "Running on localhost in production mode. Ensure domain is configured in Stack dashboard."
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs production configuration status
 */
export function logProductionStatus(): void {
  if (!isProduction) {
    return;
  }

  const validation = validateProductionConfig();

  if (validation.errors.length > 0) {
    console.error("❌ Production Configuration Errors:", validation.errors);
    throw new Error(
      `Production configuration invalid: ${validation.errors.join(", ")}`
    );
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️ Production Configuration Warnings:", validation.warnings);
  } else {
    console.log("✅ Production configuration validated successfully");
  }
}

/**
 * Production checklist items that need to be completed in Stack dashboard
 */
export const PRODUCTION_CHECKLIST = {
  domains: {
    title: "Configure Domains",
    description:
      "Add your production domain (e.g., https://bookerino.net) in the Stack dashboard under 'Domain & Handlers'",
    url: "https://app.stack-auth.com/projects",
    steps: [
      "Navigate to 'Domain & Handlers' tab in Stack dashboard",
      "Add your production domain (e.g., https://bookerino.net)",
      "Disable 'Allow all localhost callbacks for development' option",
    ],
  },
  oauth: {
    title: "Configure OAuth Providers",
    description:
      "Set up your own OAuth keys for Google, GitHub, etc. in the Stack dashboard",
    url: "https://app.stack-auth.com/projects",
    steps: [
      "Go to 'Auth Methods' section in Stack dashboard",
      "For each OAuth provider you use:",
      "  - Create an OAuth app on the provider's website",
      "  - Set callback URL to: https://api.stack-auth.com/api/v1/auth/oauth/callback/{provider}",
      "  - Switch from shared keys to custom keys in Stack dashboard",
      "  - Enter your client ID and client secret",
    ],
  },
  email: {
    title: "Configure Email Server",
    description:
      "Set up your own SMTP server for production emails",
    url: "https://app.stack-auth.com/projects",
    steps: [
      "Configure your own email server and connect it to your domain",
      "Navigate to 'Emails' section in Stack dashboard",
      "Click 'Edit' in the 'Email Server' section",
      "Switch from 'Shared' to 'Custom SMTP server'",
      "Enter your SMTP configurations and save",
    ],
  },
  productionMode: {
    title: "Enable Production Mode",
    description:
      "Enable production mode in Stack dashboard after completing all above steps",
    url: "https://app.stack-auth.com/projects",
    steps: [
      "Navigate to 'Project Settings' tab in Stack dashboard",
      "Enable production mode",
      "Verify all configurations are correct",
    ],
  },
} as const;

/**
 * Get production checklist as formatted string
 */
export function getProductionChecklist(): string {
  const checklist = Object.entries(PRODUCTION_CHECKLIST)
    .map(([key, item]) => {
      const steps = item.steps.map((step) => `  - ${step}`).join("\n");
      return `## ${item.title}\n${item.description}\n\nSteps:\n${steps}\n\nDashboard: ${item.url}\n`;
    })
    .join("\n");

  return `# Production Checklist\n\n${checklist}`;
}

