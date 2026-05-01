import 'dotenv/config';
import { sendEmail } from '../mailHelper';

/**
 * Send an email notification for a new contact form inquiry
 * @param {string} names - Name of the person contacting
 * @param {string} email - Email of the person contacting
 * @param {string} subject - Subject of the inquiry
 * @param {string} message - Content of the message
 */
export const contactForm = async (names, email, subject, message) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #1e293b; padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">HADIWA</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-weight: 600; font-size: 14px;">New Help Inquiry</p>
        </div>
        
        <div style="padding: 32px;">
          <h2 style="color: #1e293b; margin: 0 0 16px; font-size: 20px; font-weight: 800;">Message Details</h2>
          
          <div style="background-color: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
            <div style="margin-bottom: 16px;">
              <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">From</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b;">${names} (${email})</p>
            </div>
            <div style="margin-bottom: 16px;">
              <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Subject</p>
              <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b;">${subject}</p>
            </div>
            <div>
              <p style="margin: 0; font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Message</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #475569;">${message}</p>
            </div>
          </div>
          
          <a href="mailto:${email}" style="display: block; width: fit-content; background-color: #ff4400; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 800; text-align: center; margin: 0 auto;">Reply to Customer</a>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 600;">Hadiwa Admin Portal | Internal Notification</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: 'paradisebountyco@gmail.com',
    subject: `[HELP REQUEST] ${subject} - ${names}`,
    html: html
  });
};
