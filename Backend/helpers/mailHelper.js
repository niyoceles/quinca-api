import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : undefined;
  const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;

  const baseConfig = {
    auth: user && pass ? { user, pass } : undefined,
    tls: {
      rejectUnauthorized: false
    },
    // 20-second timeout allows sufficient time for TLS handshake while avoiding infinite hangs
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  };

  if (host && host !== 'smtp.gmail.com') {
    return nodemailer.createTransport({
      ...baseConfig,
      host,
      port,
      secure,
    });
  }

  // Gmail service default
  return nodemailer.createTransport({
    ...baseConfig,
    service: 'gmail',
  });
};

const transporter = createTransporter();

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.html] - HTML body
 * @param {string|string[]} [options.bcc] - BCC recipient(s)
 * @returns {Promise}
 */
export const sendEmail = async ({ to, subject, text, html, bcc }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[mailHelper] SMTP credentials (SMTP_USER / SMTP_PASS) not configured. Skipping email to:', to);
    return { skipped: true, reason: 'missing_credentials' };
  }

  const mailOptions = {
    from: `"Hadiwa" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
    bcc,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s to %s', info.messageId, to);
    return info;
  } catch (error) {
    console.error('SMTP ERROR LOG:', {
      message: error.message,
      code: error.code,
      command: error.command,
      user: process.env.SMTP_USER
    });
    throw error;
  }
};

export default sendEmail;

