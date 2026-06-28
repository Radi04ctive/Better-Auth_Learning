import { sendEmail } from "./sendEmail";

interface EmailData {
  user: {
    name: string;
    email: string;
  };
  url: string;
  newEmail: string;
}

export function sendChangeEmailConfirmationEmail({ user, url, newEmail }: EmailData) {
  return sendEmail({
    to: user.email,
    subject: "Confirm Your Email Change",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Your Email Change</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to change your email from <span className="font-bold">${user.email}</span> to <span className="font-bold">${newEmail}</span>. Click the button below to confirm it:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Confirm Change</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
      `,
    text: `Hello ${user.name},\n\nYou requested to change your email from ${user.email} to ${newEmail}. Click the button below to confirm it: ${url}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
  });
}
