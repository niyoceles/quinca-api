import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const receiverEmail = process.env.EMAIL_RECEIVER;

export const contactForm = async (names, email, subject, message) => {
  const sendEmail = {
    to: receiverEmail,
    from: email,
    Subject: subject,
    text: 'QUINCA PARADI',
    html: `<div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        ${message}  
                        <br><br>
                        Best regards, 
                        <br>
                        ${names}
                        <br>
                        <a
                            href='#'
                            style="color:#18a0fb; text-decoration:none"
                        > 
                       ${email}
                        </a>
                    </p>
                </div>`,
  };
  sGmail.setApiKey(process.env.SENDGRID_API_KEY);
  await sGmail.send(sendEmail);
};
