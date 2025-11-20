/**
 * Email automation utilities using Stack Auth
 * Sender email: ferinogroup@gmail.com
 */
import { stackServerApp } from "./stack";

export interface SendEmailOptions {
  userIds: string[];
  subject: string;
  html?: string;
  templateId?: string;
  variables?: Record<string, any>;
  notificationCategoryName?: string;
  themeId?: string | null | false;
}

export interface EmailResult {
  status: "success" | "error";
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

/**
 * Send email to users using Stack Auth
 */
export async function sendEmail(options: SendEmailOptions): Promise<EmailResult> {
  try {
    const result = await stackServerApp.sendEmail({
      userIds: options.userIds,
      subject: options.subject,
      html: options.html,
      templateId: options.templateId,
      variables: options.variables,
      notificationCategoryName: options.notificationCategoryName,
      themeId: options.themeId,
    });

    if (result.status === "error") {
      return {
        status: "error",
        error: {
          code: result.error?.code || "UNKNOWN_ERROR",
          message: result.error?.message || "Failed to send email",
        },
      };
    }

    return {
      status: "success",
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      status: "error",
      error: {
        code: "EXCEPTION",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(userId: string, userName?: string): Promise<EmailResult> {
  return sendEmail({
    userIds: [userId],
    subject: "Bun venit la Bookerino!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Bun venit la Bookerino!</h1>
        <p>Salut${userName ? `, ${userName}` : ""}!</p>
        <p>Mulțumim că te-ai înregistrat la Bookerino. Suntem încântați să te avem în echipă!</p>
        <p>Cu contul tău Bookerino poți:</p>
        <ul>
          <li>Gestiona rezervările tale</li>
          <li>Accesa rapoarte și analize</li>
          <li>Configura setările contului</li>
          <li>Gestiona abonamentul</li>
        </ul>
        <p>Dacă ai întrebări, nu ezita să ne contactezi la <a href="mailto:ferinogroup@gmail.com">ferinogroup@gmail.com</a>.</p>
        <p>Echipa Bookerino</p>
      </div>
    `,
    notificationCategoryName: "transactional",
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(userId: string, resetUrl: string): Promise<EmailResult> {
  return sendEmail({
    userIds: [userId],
    templateId: "password_reset", // Use built-in template
    subject: "Resetare parolă - Bookerino",
    variables: {
      resetUrl,
      supportEmail: "ferinogroup@gmail.com",
    },
    notificationCategoryName: "transactional",
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(userId: string, verificationUrl: string): Promise<EmailResult> {
  return sendEmail({
    userIds: [userId],
    templateId: "email_verification", // Use built-in template
    subject: "Verifică adresa ta de email - Bookerino",
    variables: {
      verificationUrl,
      supportEmail: "ferinogroup@gmail.com",
    },
    notificationCategoryName: "transactional",
  });
}

/**
 * Send trial ending reminder email
 */
export async function sendTrialEndingReminderEmail(
  userId: string,
  userName: string,
  daysRemaining: number
): Promise<EmailResult> {
  return sendEmail({
    userIds: [userId],
    subject: `Perioada ta de probă se termină în ${daysRemaining} zile`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Perioada de probă se apropie de final</h1>
        <p>Salut, ${userName}!</p>
        <p>Perioada ta de probă gratuită de 7 zile se va termina în ${daysRemaining} ${daysRemaining === 1 ? "zi" : "zile"}.</p>
        <p>Pentru a continua să beneficiezi de toate funcționalitățile Bookerino, te rugăm să îți configurezi abonamentul.</p>
        <p><a href="https://bookerino.net/pricing" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Vezi planurile disponibile</a></p>
        <p>Dacă ai întrebări, contactează-ne la <a href="mailto:ferinogroup@gmail.com">ferinogroup@gmail.com</a>.</p>
        <p>Echipa Bookerino</p>
      </div>
    `,
    notificationCategoryName: "marketing",
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
): Promise<EmailResult> {
  return sendEmail({
    userIds: [userId],
    subject: "Confirmare abonament - Bookerino",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Abonament activat cu succes!</h1>
        <p>Salut, ${userName}!</p>
        <p>Abonamentul tău la <strong>${planName}</strong> a fost activat cu succes.</p>
        <p><strong>Suma facturată:</strong> ${amount}</p>
        <p>Poți gestiona abonamentul din <a href="https://bookerino.net/profile">setările contului</a>.</p>
        <p>Dacă ai întrebări, contactează-ne la <a href="mailto:ferinogroup@gmail.com">ferinogroup@gmail.com</a>.</p>
        <p>Echipa Bookerino</p>
      </div>
    `,
    notificationCategoryName: "transactional",
  });
}

/**
 * Send marketing email about new features
 */
export async function sendFeatureUpdateEmail(
  userIds: string[],
  featureName: string,
  featureDescription: string,
  featureUrl?: string
): Promise<EmailResult> {
  return sendEmail({
    userIds,
    subject: `Nou la Bookerino: ${featureName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Nou la Bookerino!</h1>
        <h2>${featureName}</h2>
        <p>${featureDescription}</p>
        ${featureUrl ? `<p><a href="${featureUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Află mai multe</a></p>` : ""}
        <p>Echipa Bookerino</p>
      </div>
    `,
    notificationCategoryName: "marketing",
  });
}

