import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: env.BREVO_SMTP_PORT,
  secure: env.BREVO_SMTP_PORT === 465,
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  return transporter.sendMail({
    from: `"${env.BREVO_FROM_NAME}" <${env.BREVO_FROM_EMAIL}>`,
    to,
    subject,
    text,
    html,
  });
};

export const sendDailyDigestEmail = async ({
  to,
  name,
  notifications,
}) => {
  const items = notifications
    .map(
      (item) =>
        `<li style="margin-bottom:8px;"><strong>${item.title}</strong><br/>${item.message}</li>`
    )
    .join("");

  return sendEmail({
    to,
    subject: "Your AlgoForge daily digest",
    text: `Hi ${name}, you have ${notifications.length} unread updates on AlgoForge.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>AlgoForge Daily Digest</h2>
        <p>Hi ${name}, here are your latest unread updates:</p>
        <ul>${items}</ul>
      </div>
    `,
  });
};

export const sendContestReminderEmail = async ({
  to,
  name,
  contestTitle,
  startAt,
  reminderLabel,
}) => {
  return sendEmail({
    to,
    subject: `Contest reminder: ${contestTitle}`,
    text: `Hi ${name}, "${contestTitle}" starts at ${new Date(startAt).toISOString()}. Reminder: ${reminderLabel}.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Contest Reminder</h2>
        <p>Hi ${name},</p>
        <p>Your registered contest <strong>${contestTitle}</strong> starts at:</p>
        <p style="font-size:18px;font-weight:700;">${new Date(startAt).toUTCString()}</p>
        <p>Reminder window: ${reminderLabel}</p>
      </div>
    `,
  });
};

export const sendPasswordResetOtpEmail = async ({ to, otp, minutes }) => {
  return sendEmail({
    to,
    subject: "Your AlgoForge password reset OTP",
    text: `Your OTP is ${otp}. It expires in ${minutes} minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>AlgoForge Password Reset</h2>
        <p>Use this OTP to continue resetting your password:</p>
        <div style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 16px 0;">
          ${otp}
        </div>
        <p>This OTP expires in ${minutes} minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      </div>
    `,
  });
};