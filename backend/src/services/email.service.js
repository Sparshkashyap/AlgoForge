import nodemailer from "nodemailer";
import env from "../config/env.js";

/* ================= TRANSPORT ================= */

const transporter = nodemailer.createTransport({
  host: env.BREVO_SMTP_HOST,
  port: Number(env.BREVO_SMTP_PORT) || 587,
  secure: Number(env.BREVO_SMTP_PORT) === 465, // true only for 465
  auth: {
    user: env.BREVO_SMTP_USER,
    pass: env.BREVO_SMTP_PASS,
  },
});

/* ================= BASE SEND ================= */

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${env.BREVO_FROM_NAME}" <${env.BREVO_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    throw error;
  }
};

/* ================= DAILY DIGEST ================= */

export const sendDailyDigestEmail = async ({
  to,
  name,
  notifications,
}) => {
  const items = notifications
    .map(
      (item) =>
        `<li style="margin-bottom:8px;">
          <strong>${item.title}</strong><br/>
          ${item.message}
        </li>`
    )
    .join("");

  return sendEmail({
    to,
    subject: "Your AlgoForge daily digest",
    text: `Hi ${name}, you have ${notifications.length} unread updates.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>AlgoForge Daily Digest</h2>
        <p>Hi ${name}, here are your updates:</p>
        <ul>${items}</ul>
      </div>
    `,
  });
};

/* ================= CONTEST REMINDER ================= */

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
    text: `Hi ${name}, "${contestTitle}" starts at ${new Date(
      startAt
    ).toISOString()}`,
    html: `
      <div style="font-family: Arial;">
        <h2>Contest Reminder</h2>
        <p>Hi ${name},</p>
        <p><strong>${contestTitle}</strong> starts at:</p>
        <p style="font-size:18px;font-weight:700;">
          ${new Date(startAt).toUTCString()}
        </p>
        <p>${reminderLabel}</p>
      </div>
    `,
  });
};

/* ================= OTP EMAIL ================= */

export const sendPasswordResetOtpEmail = async ({
  to,
  otp,
  minutes,
}) => {
  const expiryMinutes = minutes || env.OTP_EXPIRY_MINUTES || 10;

  return sendEmail({
    to,
    subject: "Your AlgoForge password reset OTP",
    text: `Your OTP is ${otp}. It expires in ${expiryMinutes} minutes.`,
    html: `
      <div style="font-family: Arial;">
        <h2>Password Reset OTP</h2>

        <p>Use this OTP:</p>

        <div style="
          font-size:32px;
          font-weight:800;
          letter-spacing:8px;
          margin:20px 0;
          text-align:center;
        ">
          ${otp}
        </div>

        <p>Expires in <strong>${expiryMinutes} minutes</strong></p>

        <p style="color:#888;font-size:12px;">
          Ignore if not requested.
        </p>
      </div>
    `,
  });
};