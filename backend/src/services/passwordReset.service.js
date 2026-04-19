import crypto from "crypto";
import prisma from "../config/db.js";
import env from "../config/env.js";
import { hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { sendPasswordResetOtpEmail } from "./email.service.js";
import { verifyRecaptchaToken } from "./recaptcha.service.js";

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
};

const generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export const requestPasswordResetOtpService = async ({
  email,
  recaptchaToken,
  remoteIp,
}) => {
  await verifyRecaptchaToken({
    token: recaptchaToken,
    remoteIp,
    expectedAction: "forgot_password",
  });

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return {
      success: true,
      message: "If that email exists, an OTP has been sent.",
    };
  }

  await prisma.passwordResetOtp.updateMany({
    where: {
      userId: user.id,
      purpose: "PASSWORD_RESET",
      consumedAt: null,
      verifiedAt: null,
    },
    data: {
      consumedAt: new Date(),
    },
  });

  const otp = generateOtp();
  const otpHash = hashOtp(otp);
  const expiresAt = new Date(
    Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000
  );

  await prisma.passwordResetOtp.create({
    data: {
      userId: user.id,
      otpHash,
      purpose: "PASSWORD_RESET",
      expiresAt,
    },
  });

  await sendPasswordResetOtpEmail({
    to: user.email,
    otp,
  });

  return {
    success: true,
    message: "If that email exists, an OTP has been sent.",
  };
};

export const verifyPasswordResetOtpService = async ({
  email,
  otp,
  recaptchaToken,
  remoteIp,
}) => {
  await verifyRecaptchaToken({
    token: recaptchaToken,
    remoteIp,
    expectedAction: "verify_reset_otp",
  });

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  const record = await prisma.passwordResetOtp.findFirst({
    where: {
      userId: user.id,
      purpose: "PASSWORD_RESET",
      consumedAt: null,
      verifiedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!record || record.expiresAt < new Date()) {
    const error = new Error("OTP expired or invalid");
    error.statusCode = 400;
    throw error;
  }

  if (record.attempts >= env.OTP_MAX_ATTEMPTS) {
    await prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: {
        consumedAt: new Date(),
      },
    });

    const error = new Error("OTP attempts exceeded");
    error.statusCode = 400;
    throw error;
  }

  const incomingHash = hashOtp(otp);

  if (incomingHash !== record.otpHash) {
    await prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  const verificationToken = signToken({
    userId: user.id,
    email: user.email,
    purpose: "PASSWORD_RESET_OTP_VERIFIED",
  });

  await prisma.passwordResetOtp.update({
    where: { id: record.id },
    data: {
      verifiedAt: new Date(),
      verificationToken,
    },
  });

  return {
    success: true,
    message: "OTP verified successfully",
    verificationToken,
  };
};

export const resetPasswordWithOtpVerificationService = async ({
  verificationToken,
  password,
}) => {
  const record = await prisma.passwordResetOtp.findFirst({
    where: {
      verificationToken,
      purpose: "PASSWORD_RESET",
      verifiedAt: {
        not: null,
      },
      consumedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  if (!record || record.expiresAt < new Date()) {
    const error = new Error("Reset session expired");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        password: hashedPassword,
        provider: "LOCAL",
      },
    }),
    prisma.passwordResetOtp.update({
      where: { id: record.id },
      data: {
        consumedAt: new Date(),
      },
    }),
  ]);

  return {
    success: true,
    message: "Password reset successful",
  };
};

export const requestPasswordResetService = async ({ email }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    return {
      success: true,
      message: "If that email exists, a reset link has been sent.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    success: true,
    message: "If that email exists, a reset link has been sent.",
  };
};

export const resetPasswordService = async ({ token, password }) => {
  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    const error = new Error("Invalid or expired reset token");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        password: hashedPassword,
        provider: "LOCAL",
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return {
    success: true,
    message: "Password reset successful",
  };
};