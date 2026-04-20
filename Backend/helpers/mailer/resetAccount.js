import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const appUrl = process.env.APP_URL_FRONTEND;
const senderEmail = process.env.EMAIL_SENDER;
const Logo = process.env.QUINCA_LOGO;

export const resetAccountUrl = async (token, email, lastName) => {
  const resetLink = `${appUrl}/auth/set-new-password/${token}`;

  const resetMessage = {
    to: email,
    from: senderEmail,
    Subject: 'Reset Account Password',
    text: 'QUINCA PARADI',
    html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
  lastName || ''
} ,</b> here's how to reset your password account.<br />
                        We have recieved a request to have your account reset for <b>QUINCA PARADI</b>.
                        <br /> 
                        To reset your account, click on the link below:
                        <br />
                        <br />
                        <a
                            href='${resetLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        Reset your Account
                        </a>
                        <br><br>
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@quincaparadi.com
                        <br><br><br>
                        Best regards, 
                        <br>
                        QUINCA PARADI
                        <br>
                        <a
                            href='https://quincaparadi.com/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        QUINCA PARADI
                        </a>
                    </p>
                </div>
            </div>
        `,
  };
  sGmail.setApiKey(process.env.SENDGRID_API_KEY);
  await sGmail.send(resetMessage);
};

export const sendForgotPasswordUrl = async (token, email) => {
  const forgotPasswordLink = `${appUrl}/auth/password/new/${token}`;

  const forgotPasswordMessage = {
    to: email,
    from: senderEmail,
    Subject: 'Reset Password',
    text: 'QUINCA PARADI',
    html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
                <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 18px; padding: 30px;"> 
                        Hi <b>${
  email || ''
} ,</b> here's how to reset your password.<br />
                        We have recieved a request to have your password reset for <b>QUINCA PARADI</b>.
                        <br /> <br />
                        If you did not make this request, then you can just ignore this email.
                        <br /> 
                        To reset your password, click on the link below:
                        <br />
                        <br />
                        <a
                            href='${forgotPasswordLink}'
                            style="color:#d23d77; text-decoration:underline"
                            target='_blank'
                        >
                        Reset your password
                        </a>
                        <br><br>
                        Need help? Ask contact helpdesk@quincaparadi.com
                        <br><br><br>
                        Best regards, 
                        <br>
                        QUINCA PARADI
                        <br>
                        <a
                            href='https://quincaparadi.com/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        QUINCA PARADI
                        </a>
                    </p>
                </div>
            </div>
        `,
  };
  sGmail.setApiKey(process.env.SENDGRID_API_KEY);
  await sGmail.send(forgotPasswordMessage);
};
