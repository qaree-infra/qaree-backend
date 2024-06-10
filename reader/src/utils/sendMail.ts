import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { google } from "googleapis";
const { OAuth2 } = google.auth;

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

dotenv.config();

const {
	MAILING_SERVICE_CLIENT_ID,
	MAILING_SERVICE_CLIENT_SECRET,
	MAILING_SERVICE_REFRESH_TOKEN,
	GOOGLE_EMAIL,
} = process.env;

const oAuth2Client = new OAuth2(
	MAILING_SERVICE_CLIENT_ID,
	MAILING_SERVICE_CLIENT_SECRET,
	REDIRECT_URI,
);

oAuth2Client.setCredentials({ refresh_token: MAILING_SERVICE_REFRESH_TOKEN });

const headers = [
  "Comfirm the account registeration",
  "Reset your password",
]

export function generateNumberMail(type: string, number: string, name: string): {content: string; subject: string} {
  return {
content: `<div 
class='container' 
style="max-width: 1200px; padding-inline: 15px; margin-inline: auto;"
>
<table style="font-family: sans-serif; text-align: center;">
<tbody>
  <tr>
    <td>
      <h2 style="text-align: center; font-family: sans-serif;">
        Welcome to the <span style="color: #2099ff;">Qaree</span>
      </h2>        
    </td>
  </tr>
  <tr>
    <td>
      <h2>
        ${type === 'validate' ? headers[0] : headers[1]}
      </h2>
    </td>
  </tr>
  <tr>
    <td style="text-align: left; font-weight: 600;">
      <p>Hi ${name},</p>
    </td>
  </tr>
  <tr>
    <td>
      <p>
        Enter the following code to ${type === 'validate' ? headers[0] : headers[1]}
      </p>
    </td>
  </tr>
  <tr>
    <td style="font-size: 24px; padding: 10px; background: #f2f2f2; letter-spacing: 10px;">
      ${number}
    </td>
  </tr>
</tbody>
</table>
</div>`,
subject: `${type === 'validate' ? headers[0] : headers[1]} at Qaree`
  }
}

const sendMail = async (
	to: string,
  email: {content: string, subject: string}
): Promise<any> => {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const smtpTransport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: GOOGLE_EMAIL,
				clientId: MAILING_SERVICE_CLIENT_ID,
				clientSecret: MAILING_SERVICE_CLIENT_SECRET,
				refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
				accessToken,
			},
		});

		const mailOptions = {
			from: GOOGLE_EMAIL,
			to: to,
			subject: email.subject,
			html: email.content,
		};

		const result = await smtpTransport.sendMail(mailOptions);

		return result;
	} catch (error) {
		console.error(error);
		return error;
	}
};

export default sendMail;
