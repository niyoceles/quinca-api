import nodemailer from 'nodemailer';
import 'dotenv/config';

// Using 'service: gmail' is the most reliable way to connect from cloud providers
// It automatically configures the correct host, port, and security settings.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // Helps with SSL handshake issues in cloud environments like Railway
    rejectUnauthorized: false
  }
});

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
    console.log('Message sent: %s', info.messageId);
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
