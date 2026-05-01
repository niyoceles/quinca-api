import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    // This is often required for cloud hosting providers like Railway/Heroku
    // to handle SSL handshakes correctly with Gmail
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
    console.error('CRITICAL SMTP ERROR:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check your App Password.');
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.error('Connection failed. Port might be blocked by the hosting provider.');
    }
    throw error;
  }
};

export default sendEmail;
