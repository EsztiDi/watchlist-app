const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Releasesemail from "../../../models/Releasesemail";
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

          var emails = await Releasesemail.find();
          emails = emails
            .map((user) => user.email)
            .filter((email, index, arr) => arr.indexOf(email) === index);

          for (const email of emails) {
            const lists = await Watchlist.find({
              "user.email": email,
              emails: true,
            });
            if (lists.length === 0) {
              const deletedEmails = await Releasesemail.deleteMany({
                email: email,
              });
              if (!deletedEmails) {
                console.error(
                  `Couldn't perform deleteMany() in MongoDB - ${email}`
                );
              }
              continue;
            }

            var upcoming = [];
            await Watchlist.find({
              "user.email": email,
              emails: true,
            })
              .sort({
                position: -1,
              })
              .then(async (lists) => {
                lists.forEach((list) => {
                  if (list.movies.length > 0) {
                    var movies = [];
                    list.movies.forEach((movie) => {
                      var release_date = new Date(movie.release_date).getTime();
                      var today = new Date().setUTCHours(0, 0, 0, 0);
                      if (
                        release_date > today &&
                        release_date <= today + 60000 * 60 * 24 * 7
                      ) {
                        movies.push(movie);
                      }
                    });
                    if (movies.length > 0) {
                      upcoming.push({
                        id: list._id,
                        title: list.title,
                        movies: movies.sort(
                          (a, b) =>
                            new Date(a.release_date) - new Date(b.release_date)
                        ),
                      });
                    }
                  }
                });
                if (upcoming.length > 0) {
                  var user = await Releasesemail.find({ email: email });

                  recipient = [new Recipient(email, user[0].name)];
                  response.data.recipients.push(email);
                }
              });

            if (recipient.length > 0) {
              const html = weeklyHTML(upcoming);

              const emailParams = new EmailParams()
                .setFrom("contact@mywatchlists.watch")
                .setFromName("Watchlist App")
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
                });
            }
          }
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
