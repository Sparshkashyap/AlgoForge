import crypto from "crypto";
import prisma from "../config/db.js";
import env from "../config/env.js";
import { hashPassword } from "../utils/password.js";
import { sendEmail } from "./email.service.js";

export const requestPasswordResetService = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      success: true,
      message: "If that email exists, a reset link has been sent.",
    };
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const resetUrl = `${env.PASSWORD_RESET_BASE_URL}?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your AlgoForge password",
    text: `Reset your password using this link: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Reset your AlgoForge password</h2>
        <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#6d5efc;color:white;text-decoration:none;border-radius:8px;">
            Reset Password
          </a>
        </p>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `,
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