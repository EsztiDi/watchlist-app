import { getSession } from "next-auth/client";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Savedlist from "../../../models/Savedlist";
import Releasesemail from "../../../models/Releasesemail";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        return new Promise((resolve, reject) => {
          mongoose.connection.db.collection("users", async (err, users) => {
            try {
              const user = await users.findOne({
                email: session?.user.email,
              });

              if (!user) {
                console.error(
                  `User was not found - user: ${JSON.stringify(
                    user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              }

              res.status(200).json({
                success: true,
                data: user,
              });
              resolve();
            } catch (err) {
              console.error(`Error finding user - ${JSON.stringify(err)}`);
              res.status(400).json({ success: false });
              return resolve();
            }
          });
        });
      } catch (err) {
        console.error(`Error in users collection - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        return new Promise((resolve, reject) => {
          mongoose.connection.db.collection("users", async (err, users) => {
            try {
              // Updating user
              const updatedUser = await users
                .findOneAndUpdate(
                  {
                    email: session?.user.email,
                  },
                  { $set: req.body },
                  {
                    returnNewDocument: true,
                  }
                )
                .catch((err) => console.error(err));

              if (!updatedUser) {
                console.error(
                  `User was not found - user: ${JSON.stringify(
                    session?.user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              }

              // Updating Watchlist user
              const updatedLists = await Watchlist.updateMany(
                {
                  "user.email": session?.user?.email,
                },
                {
                  user: {
                    name: req.body.name,
                    email: req.body.email,
                    image: req.body.image,
                  },
                },
                {
                  timestamps: false,
                }
              ).catch((err) => console.error(err));

              if (!updatedLists) {
                console.error(
                  `Couldn't perform updateMany() for lists in MongoDB - user: ${JSON.stringify(
                    session?.user
                  )}`
                );
                return res.status(400).json({ success: false });
              }

              // Updating Savedlist user
              const updatedSavedLists = await Savedlist.updateMany(
                {
                  "user.email": session?.user?.email,
                },
                {
                  user: {
                    name: req.body.name,
                    email: req.body.email,
                    image: req.body.image,
                  },
                },
                {
                  timestamps: false,
                }
              ).catch((err) => console.error(err));

              if (!updatedSavedLists) {
                console.error(
                  `Couldn't perform updateMany() for saved lists in MongoDB - user: ${JSON.stringify(
                    session?.user
                  )}`
                );
                return res.status(400).json({ success: false });
              }

              // Updating Savedlist creator
              const updatedSavedLists2 = await Savedlist.updateMany(
                {
                  "creator.email": session?.user?.email,
                },
                {
                  creator: {
                    name: req.body.name,
                    email: req.body.email,
                    image: req.body.image,
                  },
                },
                {
                  timestamps: false,
                }
              ).catch((err) => console.error(err));

              if (!updatedSavedLists2) {
                console.error(
                  `Couldn't perform updateMany() for saved lists in MongoDB - user: ${JSON.stringify(
                    session?.user
                  )}`
                );
                return res.status(400).json({ success: false });
              }

              // Updating Releasesemail name
              const updatedEmails = await Releasesemail.updateMany(
                {
                  email: session?.user?.email,
                },
                {
                  name: req.body.name,
                },
                {
                  timestamps: false,
                }
              ).catch((err) => console.error(err));

              if (!updatedEmails) {
                console.error(
                  `Couldn't perform updateMany() for emails in MongoDB - user: ${JSON.stringify(
                    session?.user
                  )}`
                );
                return res.status(400).json({ success: false });
              }

              res.status(200).json({
                success: updatedUser.ok,
                data: updatedUser.value,
              });
              resolve();
            } catch (err) {
              console.error(`Error updating user - ${JSON.stringify(err)}`);
              res.status(400).json({ success: false });
              return resolve();
            }
          });
        });
      } catch (err) {
        console.error(`Error in users collection - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(`Wrong fetch method used for api/account - ${method}`);
      res.status(400).json({ success: false });
      break;
  }
}
