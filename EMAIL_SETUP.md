# Email Automation Setup Guide

This guide explains how to configure and use the email automation system for Bookerino using Stack Auth.

## Email Configuration

### Sender Email
- **Email Address**: `ferinogroup@gmail.com`
- **Sender Name**: Bookerino (configurable in Stack Auth dashboard)

### Stack Auth Dashboard Configuration

1. **Navigate to Stack Auth Dashboard**
   - Go to [Stack Auth Dashboard](https://app.stack-auth.com/projects)
   - Select your project (Project ID: `94d1506e-966f-4a6b-a8a6-6be48b783282`)

2. **Configure Email Server**
   - Go to **"Emails"** section
   - Click **"Edit"** in the **"Email Server"** section
   - Select **"Custom SMTP server"**
   - Configure Gmail SMTP settings:
     - **Host**: `smtp.gmail.com`
     - **Port**: `587` (TLS) or `465` (SSL)
     - **Username**: `ferinogroup@gmail.com`
     - **Password**: [Gmail App Password - see below]
     - **Sender Email**: `ferinogroup@gmail.com`
     - **Sender Name**: `Bookerino`
   - Click **"Save"** and test the configuration

### Gmail App Password Setup

Since `ferinogroup@gmail.com` uses Gmail, you need to create an App Password:

1. **Enable 2-Step Verification** (if not already enabled)
   - Go to Google Account settings
   - Security → 2-Step Verification → Turn on

2. **Create App Password**
   - Go to Google Account → Security
   - Under "Signing in to Google" → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Bookerino Stack Auth"
   - Copy the generated 16-character password
   - Use this password in Stack Auth SMTP configuration

## Environment Variables

Set the following environment variables on your server:

```env
STACK_PROJECT_ID=94d1506e-966f-4a6b-a8a6-6be48b783282
STACK_SECRET_SERVER_KEY=your-secret-server-key-here
```

**Important**: Never expose `STACK_SECRET_SERVER_KEY` to the client-side code!

## Available Email Functions

### Server-Side Functions (`server/email.ts`)

1. **`sendEmail()`** - Send custom HTML email
2. **`sendWelcomeEmail()`** - Welcome email for new users
3. **`sendPasswordResetEmail()`** - Password reset email
4. **`sendEmailVerificationEmail()`** - Email verification
5. **`sendTrialEndingReminderEmail()`** - Trial ending reminder
6. **`sendSubscriptionConfirmationEmail()`** - Subscription confirmation
7. **`sendFeatureUpdateEmail()`** - Marketing email about new features

### Client-Side Functions (`client/src/website/lib/emailApi.ts`)

All server-side functions have corresponding client-side API wrappers that call the server endpoints.

## API Endpoints

All email endpoints require authentication (except password reset):

- `POST /api/email/send` - Send custom email
- `POST /api/email/welcome` - Send welcome email
- `POST /api/email/password-reset` - Send password reset (no auth required)
- `POST /api/email/verify` - Send email verification
- `POST /api/email/trial-reminder` - Send trial reminder
- `POST /api/email/subscription-confirmation` - Send subscription confirmation
- `POST /api/email/feature-update` - Send feature update (marketing)

## Usage Examples

### Server-Side Usage

```typescript
import { sendWelcomeEmail } from "./email";

// Send welcome email after user registration
await sendWelcomeEmail(userId, "John Doe");
```

### Client-Side Usage

```typescript
import { sendWelcomeEmail } from "../lib/emailApi";

// Send welcome email from client
try {
  await sendWelcomeEmail(userId, "John Doe");
  console.log("Welcome email sent!");
} catch (error) {
  console.error("Failed to send email:", error);
}
```

## Email Types

### Transactional Emails
- Welcome emails
- Password reset
- Email verification
- Subscription confirmations

These emails cannot be opted out of and are required for the application to function.

### Marketing Emails
- Trial reminders
- Feature updates
- Product announcements

These emails include unsubscribe links and respect user preferences.

## Notification Categories

Emails can be organized into notification categories:
- `transactional` - Required emails
- `marketing` - Optional marketing emails
- `product_updates` - Product update emails

Users can control which categories they receive through their account settings.

## Error Handling

All email functions return a result object:

```typescript
{
  status: "success" | "error",
  error?: {
    code: string,
    message: string
  },
  message?: string
}
```

Common error codes:
- `REQUIRES_CUSTOM_EMAIL_SERVER` - SMTP not configured
- `SCHEMA_ERROR` - Invalid email data
- `USER_ID_DOES_NOT_EXIST` - User ID not found

## Best Practices

1. **Always handle errors** - Check result status before assuming success
2. **Use templates** - Leverage built-in templates for consistency
3. **Respect user preferences** - Use notification categories appropriately
4. **Server-side only** - Never send emails directly from client code
5. **Test thoroughly** - Test email sending in development before production

## Troubleshooting

### Emails not sending
- Check SMTP configuration in Stack Auth dashboard
- Verify Gmail App Password is correct
- Check server logs for error messages
- Ensure `STACK_SECRET_SERVER_KEY` is set correctly

### Gmail blocking emails
- Ensure App Password is used (not regular password)
- Check Gmail account security settings
- Verify sender email matches SMTP username

### Authentication errors
- Verify `STACK_SECRET_SERVER_KEY` is set
- Check that Project ID matches Stack Auth dashboard
- Ensure server has internet access to Stack Auth API

## Additional Resources

- [Stack Auth Email Documentation](https://docs.stack-auth.com/docs/apps/emails)
- [Gmail SMTP Settings](https://support.google.com/a/answer/176600)
- [Stack Auth Dashboard](https://app.stack-auth.com/projects)

