import "dotenv/config";

const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  DATABASE_URL: process.env.DATABASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || "",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",
  RAZORPAY_PRO_MONTHLY_PLAN_ID:
    process.env.RAZORPAY_PRO_MONTHLY_PLAN_ID || "",
  RAZORPAY_PRO_YEARLY_PLAN_ID:
    process.env.RAZORPAY_PRO_YEARLY_PLAN_ID || "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL || "",
};

export default env;