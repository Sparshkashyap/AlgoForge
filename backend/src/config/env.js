import "dotenv/config";

const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",

GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "",

SESSION_SECRET: process.env.SESSION_SECRET || "",

BREVO_SMTP_HOST: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
BREVO_SMTP_PORT: Number(process.env.BREVO_SMTP_PORT || 587),
BREVO_SMTP_USER: process.env.BREVO_SMTP_USER || "",
BREVO_SMTP_PASS: process.env.BREVO_SMTP_PASS || "",
BREVO_FROM_EMAIL: process.env.BREVO_FROM_EMAIL || "",
BREVO_FROM_NAME: process.env.BREVO_FROM_NAME || "AlgoForge",
PASSWORD_RESET_BASE_URL: process.env.PASSWORD_RESET_BASE_URL || "http://localhost:5173/reset-password",


RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
RAZORPAY_STANDARD_PLAN_ID: process.env.RAZORPAY_STANDARD_PLAN_ID || "",
RAZORPAY_PRO_PLAN_ID: process.env.RAZORPAY_PRO_PLAN_ID || "",

CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

};

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in backend/.env");
}

if (!env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in backend/.env");
}

if (!env.JUDGE0_API_URL) {
  throw new Error("JUDGE0_API_URL is missing in backend/.env");
}

if (!env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing in backend/.env");
}

if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
  console.warn("Razorpay keys are missing. Billing will not work.");
}

export default env;