import nodemailer from 'nodemailer'

// Create a test account automatically
export const account = await nodemailer.createTestAccount();

// Create a transporter using the test account
export const transporter = nodemailer.createTransport({
  host: account.smtp.host,
  port: account.smtp.port,
  secure: account.smtp.secure,
  auth: {
    user: account.user,
    pass: account.pass,
  },
});

