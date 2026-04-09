import bcrypt from "bcryptjs";
import env from "../config/env.js";

export const hashPassword = async (plainPassword) => {
  return bcrypt.hash(plainPassword, env.BCRYPT_SALT_ROUNDS);
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};