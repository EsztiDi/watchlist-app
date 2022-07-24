const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Savedlist from "../../../models/Savedlist";
import Releasesemail from "../../../models/Releasesemail";
import weeklyHTML from "../../../templates/weeklyHtml";
import weeklyText from "../../../templates/weeklyText";

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

          var emails = await Releasesemail.find().catch((err) =>
            console.error(err)
          );
          emails = emails
            .map((user) => user.email)
            .filter((email, index, arr) => arr.indexOf(email) === index);

          for (const email of emails) {
            // If no lists with emails: true delete the email subscriptions
            const lists = await Watchlist.find({
              "user.email": email,
              emails: true,
            }).catch((err) => console.error(err));
            if (lists.length === 0) {
              const deletedEmails = await Releasesemail.deleteMany({
                email: email,
                savedList: false,
              }).catch((err) => console.error(err));
              if (!deletedEmails) {
                console.error(
                  `Couldn't perform deleteMany() for Reseleasesemail savedList: false in MongoDB - ${email}`
                );
              }
            }
            // If no saved lists with emails: true delete the email subscriptions
            const savedLists = await Savedlist.find({
              "user.email": email,
              emails: true,
            }).catch((err) => console.error(err));
            if (savedLists.length === 0) {
              const deletedEmails2 = await Releasesemail.deleteMany({
                email: email,
                savedList: true,
              }).catch((err) => console.error(err));
              if (!deletedEmails2) {
                console.error(
                  `Couldn't perform deleteMany() for Reseleasesemail savedList: true in MongoDB - ${email}`
                );
              }
              if (lists.length === 0) continue;
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
                      // .setUTCHours(0, 0, 0, 0);
                      var today = new Date().getTime();
                      // .setUTCHours(0, 0, 0, 0);
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
              })
              .catch((err) => console.error(err));

            await Savedlist.find({
              "user.email": email,
              emails: true,
            })
              .sort({
                position: -1,
              })
              .then(async (lists) => {
                await Promise.all(
                  lists.map(async (savedList) => {
                    await Watchlist.findById(savedList?.listid).then(
                      async (list) => {
                        if (list.movies.length > 0) {
                          var movies = [];
                          list.movies.forEach((movie) => {
                            var release_date = new Date(
                              movie.release_date
                            ).getTime();
                            // .setUTCHours(0, 0, 0, 0);
                            var today = new Date().getTime();
                            // .setUTCHours(0, 0, 0, 0);
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
                              uid: savedList.uid,
                              title: list.title,
                              creator: list.user?.name || "Anonymous",
                              movies: movies.sort(
                                (a, b) =>
                                  new Date(a.release_date) -
                                  new Date(b.release_date)
                              ),
                            });
                          }
                        }
                      }
                    );
                  })
                );
              })
              .catch((err) => console.error(err));

            if (upcoming.length > 0) {
              var user = await Releasesemail.findOne({ email: email }).catch(
                (err) => console.error(err)
              );
              recipient = [new Recipient(email, user?.name)];
              response.data.recipients.push(email);
            }

            if (recipient.length > 0) {
              const html = weeklyHTML(upcoming);
              const text = weeklyText(upcoming);

              const emailParams = new EmailParams()
                .setFrom("releases@mywatchlists.xyz")
                .setFromName("Watchlist App")
                .setRecipients(recipient)
                .setSubject("Your weekly releases summary")
                .setHtml(html)
                .setText(text);

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
                    `MailerSend couldn't send the weekly releases email - ${JSON.stringify(
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
