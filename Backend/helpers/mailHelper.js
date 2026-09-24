import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// sendEmail — Unified email helper
//
// Priority:
//   1. Resend HTTP API  (RESEND_API_KEY set) — works on DigitalOcean since it
//      uses HTTPS port 443. DigitalOcean permanently blocks SMTP (25/465/587).
//   2. Nodemailer/SMTP fallback              — used in local development only.
// ─────────────────────────────────────────────────────────────────────────────

const SENDER_FROM = process.env.EMAIL_FROM || 'Hadiwa <noreply@hadiwa.com>';

/**
 * Send an email.
 * @param {Object} options
 * @param {string|string[]} options.to       - Recipient email(s)
 * @param {string}          options.subject  - Email subject
 * @param {string}          [options.html]   - HTML body
 * @param {string}          [options.text]   - Plain-text body
 * @param {string|string[]} [options.bcc]    - BCC recipient(s)
 */
export const sendEmail = async ({ to, subject, html, text, bcc }) => {
  // ── 1. Resend (production) ────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const payload = {
      from: SENDER_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    };
    if (bcc) payload.bcc = Array.isArray(bcc) ? bcc : [bcc];

    const { data, error } = await resend.emails.send(payload);
    if (error) {
      console.error('[mailHelper] Resend error:', error);
      throw new Error(error.message || 'Failed to send email via Resend');
    }
    console.log('[mailHelper] Email sent via Resend. id:', data.id, 'to:', to);
    return data;
  }

  // ── 2. Nodemailer / SMTP fallback (local dev) ─────────────────────────────
  const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : undefined;
  const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : undefined;

  if (!smtpUser || !smtpPass) {
    console.warn('[mailHelper] No RESEND_API_KEY and no SMTP credentials — skipping email to:', to);
    return { skipped: true, reason: 'missing_credentials' };
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  const transportConfig = host && host !== 'smtp.gmail.com'
    ? { host, port, secure }
    : { service: 'gmail' };

  const transporter = nodemailer.createTransport({
    ...transportConfig,
    auth: { user: smtpUser, pass: smtpPass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  const info = await transporter.sendMail({
    from: `"Hadiwa" <${smtpUser}>`,
    to,
    subject,
    html,
    text,
    bcc,
  });

  console.log('[mailHelper] Email sent via SMTP. id:', info.messageId, 'to:', to);
  return info;
};

export default sendEmail;
