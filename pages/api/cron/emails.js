const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

import mongoose from "mongoose";

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;

  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_API_KEY,
  });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        return new Promise(async (resolve, reject) => {
          console.log("Sending weekly emails");

          var recipients = [];
          var personalization = [];

          await new Promise((resolve, reject) => {
            mongoose.connection.db.collection("users", async (err, users) => {
              try {
                var cursor = users.find();
                await cursor.forEach(async (user) => {
                  var upcoming = [];
                  await Watchlist.find({
                    "user.email": user.email,
                    emails: true,
                  })
                    .sort({
                      position: -1,
                    })
                    .then((lists) => {
                      lists.forEach((list) => {
                        if (list.movies.length > 0) {
                          var movies = [];
                          list.movies.forEach((movie) => {
                            var release_date = new Date(
                              movie.release_date
                            ).getTime();
                            var today = new Date().setUTCHours(0, 0, 0, 0);
                            if (
                              release_date > today &&
                              release_date < today + 60000 * 60 * 24 * 7
                            ) {
                              movies.push(movie);
                            }
                          });
                          if (movies.length > 0) {
                            upcoming.push({
                              title: list.title,
                              movies: movies.sort(
                                (a, b) => a.release_date - b.release_date
                              ),
                            });
                          }
                        }
                      });
                      if (upcoming.length > 0) {
                        recipients.push(new Recipient(user.email, user.name));
                        personalization.push({
                          email: user.email,
                          data: [
                            {
                              lists: upcoming,
                            },
                          ],
                        });
                        resolve();
                      }
                    });
                });
              } catch (err) {
                console.error(`Error finding users - ${JSON.stringify(err)}`);
                res
                  .status(400)
                  .json({ success: false, data: `${JSON.stringify(err)}` });
                return resolve();
              }
            });
          });

          const emailParams = new EmailParams()
            .setFrom("thewatchlistapp@gmail.com")
            .setFromName("The Watchlist App")
            .setRecipients(recipients)
            .setPersonalization(personalization)
            .setTemplateId("jy7zpl93krl5vx6k");

          mailersend
            .send(emailParams)
            .then((response) => response.json())
            .then((data) => {
              res.status(200).json({
                success: data.errors ? false : true,
                data: data,
              });
              console.log("Emails sent");
              resolve();
            });
        });
      } catch (err) {
        console.error(`Couldn't send emails - ${JSON.stringify(err)}`);
        res
          .status(400)
          .json({ success: false, data: `${JSON.stringify(err)}` });
      }
      break;

    default:
      console.error(`Wrong fetch method used for api/cron/emails - ${method}`);
      break;
  }
}
