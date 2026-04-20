import 'dotenv/config';
import sGmail from '@sendgrid/mail';

const appUrl = process.env.APP_URL_FRONTEND;
const senderEmail = process.env.EMAIL_SENDER;
const Logo = process.env.QUINCA_LOGO;
const visitOurWebsite = `or <br>
Visit our website to <br> <button style="color:#18a0fb; font-size: 18px;"><a
    href='https://quincaparadi.com/'
    style="text-decoration:none; color:#18a0fb;"
    target='_blank'
        > 
        view more
        </a>
    </button>`;

export const subscribed = async (email, id) => {
	const unsubscribeLink = `${appUrl}/maillist/unsubcribe/${id}`;
	const subscribeMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Subscribed Confirmation #QUINCAPARADI',
		text: 'Rwanda Chamber Of Tourism',
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
    <img src=${Logo} width="100px" height="75px" alt="logo"/>
    <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 14px; padding: 30px;"> 
                        Dear <b>${email}</b> ,
                        <br><br>
                        Thanks, your subscription has been confirmed. 
                        You've been added to our list and will hear from us soon.
                        <br> <br>
                        
                        Need help? Ask our Call center <b>8181</b>  or contact helpdesk@rcot.org.rw
                        <br><br>
                        Best regards, 
                        <br>
                        <a
                            href='https://rcot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                    <p>
                <center>   If you don't want to hear from us
                    <a
                    href='${unsubscribeLink}'
                    style="color:#f44336; font-size: 14px; text-decoration:none"
                    target='_blank'
                > 
                Unsubscribe
                </a>
                </center> 
                <br> <br>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY);
	await sGmail.send(subscribeMessage);
};

export const unsubscribed = async email => {
	const subscribeLink = `${appUrl}/maillist/subcribe/${email}`;
	const unsubscribeMessage = {
		to: email,
		from: senderEmail,
		Subject: 'Successful unsubcribed #RCOT Confirmation',
		text: 'Rwanda Chamber Of Tourism',
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
            <img src=${Logo} width="100px" height="75px" alt="logo"/>
                <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 14px; padding: 30px;"> 
                        Dear <b>${email}</b> ,<br>
                        <br> 
                        You've been removed to our mail list, Sorry to see you go.
                        <br>             
                        Need to stay in touch again? back to subscribe on our website
                        <a
                        href='${subscribeLink}'
                        style="color:#f44336; font-size: 14px; text-decoration:none"
                        target='_blank'
                    > 
                    Here
                    </a>
                        <br><br>
                        Best regards, 
                        <br>
                        Chamber Of Tourism
                        <br>
                        <a
                            href='https://rcot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Chamber Of Tourism
                        </a>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY);
	await sGmail.send(unsubscribeMessage);
};

export const sendToSubscribers = async (email, message, title, link, id) => {
	const unsubscribeLink = `${appUrl}/unsubscribe/${id}`;
	const urllink = `${appUrl}/${link}`;
	const subscribeMessage = {
		to: email,
		from: senderEmail,
		Subject: `${title} [#Rwanda Chamber Of Tourism]`,
		text: 'Rwanda Chamber Of Tourism',
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
           <img src=${Logo} width="100px" height="75px" alt="logo"/>
               <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 12px important; padding: 30px;"> 
                        Dear <b>${email}</b> ,
                        <br><br>
                         ${message}
                         <br>
                  to view more Click <button><a
                         href='${urllink}'
                         style="color:#d23d77; text-decoration:underline"
                         target='_blank'
                     > 
                     HERE
                     </a>
                     </button>
                     <br>
                     ${visitOurWebsite}
                        <br> <br>
                        Best regards, 
                        <br>
                        <a
                            href='https://rcot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Rwanda Chamber Of Tourism
                        </a>
                    </p>
                    <p>
                <center>Don't want to receive these emails?
                    <a
                    href='${unsubscribeLink}'
                    style="color:#f44336; font-size: 14px; text-decoration:none"
                    target='_blank'
                > 
                Unsubscribe
                </a>
                </center>  
                <br>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY);
	await sGmail.send(subscribeMessage);
};

export const sendPubtoScribers = async (email, documentLink, title, id) => {
	const unsubscribeLink = `${appUrl}/unsubscribe/${id}`;
	const subscribeMessage = {
		to: email,
		from: senderEmail,
		Subject: `${title} [#Rwanda Chamber Of Tourism]`,
		text: 'Rwanda Chamber Of Tourism',
		html: `<div style="background-color: #f9a758; padding: 30px; width: 80%; margin-left: 8%;">
           <img src=${Logo} width="100px" height="75px" alt="logo"/>
               <div style="background-color: white; border-radius: 10px;">
                    <p style="font-size: 14px important; padding: 30px;"> 
                        Dear <b>${email}</b> ,
                        <br><br>
                        Rwanda Chamber Of Tourism published ${title}
                         <br>
                       To view more about this publication, <button><a
                         href='${documentLink}'
                         style="text-decoration:underline"
                         target='_blank'
                     > 
                     Click here
                     </a>
                     </button>
                     <br>
                     ${visitOurWebsite}
                        <br> <br>
                        Best regards, 
                        <br>
                        <a
                            href='https://rcot.org.rw/'
                            style="color:#18a0fb; text-decoration:none"
                            target='_blank'
                        > 
                        Rwanda Chamber Of Tourism
                        </a>
                    </p>
                    <p>
                <center>Don't want to receive these emails?
                    <a
                    href='${unsubscribeLink}'
                    style="color:#f44336; font-size: 14px; text-decoration:none"
                    target='_blank'
                > 
                Unsubscribe
                </a>
                </center>  
                <br>
                    </p>
                </div>
            </div>
        `,
	};
	sGmail.setApiKey(process.env.SENDGRID_API_KEY);
	await sGmail.send(subscribeMessage);
};
