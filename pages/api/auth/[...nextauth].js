import NextAuth from "next-auth";
import Providers from "next-auth/providers";

import loginHTML from "../../../templates/loginEmail";
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_APP_KEY,
      clientSecret: process.env.TWITTER_APP_KEY_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Providers.Email({
      sendVerificationRequest: ({
        identifier: email,
        url,
        token,
        baseUrl,
        provider,
      }) => {
        return new Promise(async (resolve, reject) => {
          const mailersend = new MailerSend({
            api_key: process.env.MAILERSEND_API_KEY,
          });
          // Strip protocol from URL and use domain as site name
          const site = baseUrl.replace(/^https?:\/\//, "");
          const recipient = [new Recipient(email)];

          const html = loginHTML({ url, email });
          const text = ({ url, site, email }) =>
            `Sign in as ${email} to ${site}\n${url}\n\n`;

          const emailParams = new EmailParams()
            .setFrom("contact@mywatchlists.watch")
            .setFromName("Watchlist App")
            .setRecipients(recipient)
            .setSubject(`Sign in to ${site}`)
            .setHtml(html)
            .setText(text({ url, site, email }));

          await mailersend.send(emailParams).catch((err) => {
            if (error) {
              console.error(
                `MailerSend couldn't send the login email - ${JSON.stringify(
                  err
                )}`
              );
              return reject(new Error("SEND_VERIFICATION_EMAIL_ERROR", error));
            }
            return resolve();
          });
        });
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  database: process.env.MONGODB_URI,
});
