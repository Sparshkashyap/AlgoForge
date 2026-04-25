import prisma from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { verifyRecaptchaToken } from "./recaptcha.service.js";
import {
  createLoginEventService,
  getRecentFailedLoginCountService,
} from "./audit.service.js";

const selectSafeUser = {
  id: true,
  name: true,
  username: true,
  email: true,
  role: true,
  plan: true,
  avatarUrl: true,
  solvedCount: true,
  streak: true,
  isBlocked: true,
  blockedAt: true,
  blockedReason: true,
  createdAt: true,
  lastSeenAt: true,
};

const slugifyUsername = (name = "") => {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
};

const generateUniqueUsername = async (name) => {
  const base = slugifyUsername(name) || "user";

  for (let i = 0; i < 10; i += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const username = `${base}${suffix}`;

    const existing = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!existing) return username;
  }

  return `${base}${Date.now()}`;
};

export const signupService = async ({
  name,
  email,
  password,
  recaptchaToken,
  remoteIp,
}) => {
  await verifyRecaptchaToken({
    token: recaptchaToken,
    remoteIp,
  });

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const username = await generateUniqueUsername(name);
  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      username,
      email: normalizedEmail,
      password: hashedPassword,
      provider: "LOCAL",
      role: "USER",
      lastSeenAt: new Date(),
    },
    select: selectSafeUser,
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};

export const loginService = async ({
  identifier,
  email,
  password,
  recaptchaToken,
  remoteIp,
  userAgent,
}) => {
  await verifyRecaptchaToken({
    token: recaptchaToken,
    remoteIp,
  });

  const rawIdentifier = String(identifier || email || "")
    .trim()
    .toLowerCase();

  const recentFailedCount = await getRecentFailedLoginCountService({
    email: rawIdentifier,
    ipAddress: remoteIp,
    withinMinutes: 30,
  });

  const suspiciousByVolume = recentFailedCount >= 5;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: rawIdentifier },
        { username: rawIdentifier },
      ],
    },
  });

  if (!existingUser || !existingUser.password) {
    await createLoginEventService({
      email: rawIdentifier,
      success: false,
      reason: "USER_NOT_FOUND_OR_NO_PASSWORD",
      ipAddress: remoteIp,
      userAgent,
      isSuspicious: suspiciousByVolume,
    });

    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (existingUser.isBlocked) {
    await createLoginEventService({
      userId: existingUser.id,
      email: existingUser.email,
      success: false,
      reason: "ACCOUNT_BLOCKED",
      ipAddress: remoteIp,
      userAgent,
      isSuspicious: true,
    });

    const error = new Error(
      existingUser.blockedReason
        ? `Account blocked: ${existingUser.blockedReason}`
        : "Your account has been blocked"
    );
    error.statusCode = 403;
    throw error;
  }

  const passwordValid = await comparePassword(password, existingUser.password);

  if (!passwordValid) {
    await createLoginEventService({
      userId: existingUser.id,
      email: existingUser.email,
      success: false,
      reason: "INVALID_PASSWORD",
      ipAddress: remoteIp,
      userAgent,
      isSuspicious: suspiciousByVolume,
    });

    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      lastSeenAt: new Date(),
    },
    select: selectSafeUser,
  });

  await createLoginEventService({
    userId: user.id,
    email: user.email,
    success: true,
    reason: "LOGIN_SUCCESS",
    ipAddress: remoteIp,
    userAgent,
    isSuspicious: suspiciousByVolume,
  });

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user,
    token,
  };
};