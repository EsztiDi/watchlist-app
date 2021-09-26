import { getSession } from "next-auth/client";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        var hasLists = null;
        var id = null;
        var newUser = null;

        if (session) {
          var results = await Watchlist.find(
            { user: session?.user },
            "_id"
          ).sort({
            position: -1,
          });
          hasLists = results.length > 0;
          if (hasLists) {
            id = await JSON.parse(JSON.stringify(results[0]._id));
          }

          const user = await new Promise((resolve, reject) => {
            mongoose.connection.db.collection("users", async (err, users) => {
              var user = null;
              try {
                const result = await users.findOne({
                  email: session?.user?.email,
                });
                if (result) {
                  user = await JSON.parse(JSON.stringify(result));
                }
                return resolve(user);
              } catch (err) {
                console.error(`Error finding user - ${err}`);
                return resolve();
              }
            });
          });

          newUser =
            new Date(user?.createdAt).getTime() > new Date() - 30 * 1000;

          if (newUser && !hasLists) {
            try {
              const contentType = "application/json";

              const res1 = await fetch(`${process.env.BASE_URL}/api/lists`, {
                method: "POST",
                headers: {
                  Accept: contentType,
                  "Content-Type": contentType,
                },
                body: JSON.stringify({
                  title: "To Watch",
                  movies: [],
                  private: true,
                  emails: false,
                  user: session?.user,
                  position: 1,
                }),
              });

              const res2 = await fetch(`${process.env.BASE_URL}/api/lists`, {
                method: "POST",
                headers: {
                  Accept: contentType,
                  "Content-Type": contentType,
                },
                body: JSON.stringify({
                  title: "Watched",
                  movies: [],
                  private: true,
                  emails: false,
                  user: session?.user,
                  position: 0,
                }),
              });

              if (!res1.ok) {
                throw new Error(res1.status);
              }
              if (!res2.ok) {
                throw new Error(res2.status);
              }
            } catch (err) {
              console.error(err.message + " - Failed to add first lists");
            }
            var results = await Watchlist.find(
              { user: session?.user },
              "_id"
            ).sort({
              position: -1,
            });
            hasLists = results.length > 0;
            if (hasLists) {
              id = await JSON.parse(JSON.stringify(results[0]._id));
            }
          }
        }

        res
          .status(200)
          .json({
            success: true,
            data: { hasLists, id, newUser, email: session?.user?.email },
          });
      } catch (err) {
        console.error(
          `Lists not found -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/lists/newuser - user: ${JSON.stringify(
          session?.user
        )} - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
