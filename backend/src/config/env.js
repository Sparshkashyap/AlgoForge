import "dotenv/config";

const env = {
  PORT: Number(process.env.PORT || 5000),
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  DATABASE_URL: process.env.DATABASE_URL || "",
  DIRECT_URL: process.env.DIRECT_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS || 10),

  JUDGE0_API_URL: process.env.JUDGE0_API_URL || "",
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || "",
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

export default env;