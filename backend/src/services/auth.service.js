import prisma from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  plan: true,
  streak: true,
  solvedCount: true,
  createdAt: true
};

export const signupService = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    const error = new Error("User already exists with this email");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER"
    },
    select: safeUserSelect
  });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user,
    token
  };
};

export const loginService = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.password) {
    const error = new Error("Use social login for this account");
    error.statusCode = 400;
    throw error;
  }

  const matched = await comparePassword(password, user.password);

  if (!matched) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    plan: user.plan,
    streak: user.streak,
    solvedCount: user.solvedCount,
    createdAt: user.createdAt
  };

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role
  });

  return {
    user: safeUser,
    token
  };
};

export const getMeService = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: safeUserSelect
  });
};

export const promoteUserToAdminService = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      role: "ADMIN"
    },
    select: safeUserSelect
  });
};