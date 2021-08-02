const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

import mongoose from "mongoose";

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import weeklyHTML from "../../../templates/weekly";

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

          var recipient = [];
          var response = {
            success: true,
            data: {
              status: [],
              statusText: [],
              error: [],
              emails: 0,
              recipients: [],
            },
          };

          await new Promise((resolve, reject) => {
            mongoose.connection.db.collection("users", async (err, users) => {
              try {
                var cursor = users.find();
                for await (const user of cursor) {
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
                                (a, b) =>
                                  new Date(a.release_date) -
                                  new Date(b.release_date)
                              ),
                            });
                          }
                          console.log(upcoming[0]?.movies);
                        }
                      });
                      if (upcoming.length > 0) {
                        recipient = [new Recipient(user.email, user.name)];
                        response.data.recipients.push(user.email);
                      }
                    });

                  if (recipient.length > 0) {
                    const html = weeklyHTML(upcoming);

                    const emailParams = new EmailParams()
                      .setFrom("releases@mywatchlists.watch")
                      .setFromName("The Watchlist App")
                      .setRecipients(recipient)
                      .setSubject("Upcoming releases from your watchlists")
                      .setHtml(html)
                      .setText("Upcoming releases from your watchlists");

                    await mailersend
                      .send(emailParams)
                      .then((data) => {
                        response = {
                          ...response,
                          success: data?.error ? false : true,
                          data: {
                            ...response.data,
                            ...data,
                            status: [...response.data.status, data?.status],
                            statusText: [
                              ...response.data.statusText,
                              data?.statusText,
                            ],
                            error: [...response.data.error, data?.error],
                            emails: (response.data.emails += 1),
                          },
                        };
                        resolve();
                      })
                      .catch((err) => {
                        console.error(
                          `MailerSend couldn't send the email - ${JSON.stringify(
                            err
                          )}`
                        );
                        response = {
                          success: false,
                          data: {
                            ...response.data,
                            error: `${JSON.stringify(err)}`,
                          },
                        };
                        return resolve();
                      });
                  }
                }
                resolve();
              } catch (err) {
                console.error(`Error finding users - ${JSON.stringify(err)}`);
                response = {
                  success: false,
                  data: {
                    ...response.data,
                    error: `${JSON.stringify(err)}`,
                  },
                };
                return resolve();
              }
            });
          });
          console.log("Done - ", response);
          res.status(200).json(response);
          resolve();
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
