import "dotenv/config";

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  CLIENT_URL:
    process.env.CLIENT_URL ||
    process.env.PASSWORD_RESET_BASE_URL?.replace(/\/reset-password\/?$/, "") ||
    "http://localhost:5173",

  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  SESSION_SECRET: process.env.SESSION_SECRET || "session_secret",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  REDIS_URL: process.env.REDIS_URL || "",

  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "",

  BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
  BREVO_SMTP_PORT: Number(process.env.BREVO_SMTP_PORT || 587),
  BREVO_SMTP_USER: process.env.BREVO_SMTP_USER || "",
  BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS || "",
  BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || "",
  BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || "AlgoForge",
  PASSWORD_RESET_BASE_URL:
    process.env.PASSWORD_RESET_BASE_URL ||
    "http://localhost:5173/reset-password",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  RAZORPAY_STANDARD_PLAN_ID: process.env.RAZORPAY_STANDARD_PLAN_ID || "",
  RAZORPAY_PRO_PLAN_ID: process.env.RAZORPAY_PRO_PLAN_ID || "",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL:
    process.env.GEMINI_MODEL || "gemini-2.5-flash",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "",
  RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY || "",
  RECAPTCHA_MIN_SCORE: Number(process.env.RECAPTCHA_MIN_SCORE || 0.5),

  OTP_EXPIRY_MINUTES: Number(process.env.OTP_EXPIRY_MINUTES || 10),
  OTP_MAX_ATTEMPTS: Number(process.env.OTP_MAX_ATTEMPTS || 5),

  DAILY_DIGEST_CRON: process.env.DAILY_DIGEST_CRON || "0 0 9 * * *",
  CONTEST_REMINDER_MINUTES:
    process.env.CONTEST_REMINDER_MINUTES || "1440,60",
};

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in backend/.env");
}

if (!env.JWT_SECRET && !env.JWT_ACCESS_SECRET) {
  throw new Error(
    "JWT_SECRET or JWT_ACCESS_SECRET is missing in backend/.env"
  );
}

if (!env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing in backend/.env");
}

if (!env.JUDGE0_API_URL) {
  console.warn("JUDGE0_API_URL is missing. Code execution will not work.");
}

if (!env.REDIS_URL) {
  console.warn("REDIS_URL is missing. Realtime/cache/background features may not work.");
}

if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay keys are missing. Billing will not work.");
}

if (
  (env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_SECRET) &&
  (!env.CLOUDINARY_CLOUD_NAME ||
    !env.CLOUDINARY_API_KEY ||
    !env.CLOUDINARY_API_SECRET)
) {
  console.warn("Cloudinary config is incomplete. Avatar upload may fail.");
}

export default env;