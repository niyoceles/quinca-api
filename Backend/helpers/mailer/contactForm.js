import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const receiverEmail = process.env.EMAIL_RECEIVER;

export const contactForm = async (names, email, subject, message) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey || apiKey === '') {
    console.warn('SENDGRID_API_KEY is not configured. Email will not be sent.');
    return;
  }

  const sendEmail = {
    to: receiverEmail || 'niyoceles3@gmail.com',
    from: process.env.SENDER_EMAIL || 'support@hadiwa.rw',
    replyTo: email,
    subject: subject,
    text: `Contact from ${names} (${email}): ${message}`,
    html: `<div style="background-color: white; border-radius: 10px; padding: 30px; font-family: sans-serif;">
                    <h2 style="color: #ff4400; margin-bottom: 20px;">New Inquiry</h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #334155;"> 
                        ${message}  
                    </p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                        <p style="font-size: 14px; color: #64748b; margin: 0;">Best regards,</p>
                        <p style="font-size: 16px; font-weight: bold; color: #1e293b; margin: 4px 0;">${names}</p>
                        <a href="mailto:${email}" style="color: #ff4400; text-decoration: none; font-size: 14px; font-weight: 600;">${email}</a>
                    </div>
                </div>`,
  };
  sGmail.setApiKey(apiKey);
  await sGmail.send(sendEmail);
};
