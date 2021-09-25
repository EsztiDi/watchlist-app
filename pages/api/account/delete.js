import { getSession } from "next-auth/client";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Releasesemail from "../../../models/Releasesemail";
import Savedlist from "../../../models/Savedlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "DELETE":
      try {
        return new Promise((resolve, reject) => {
          mongoose.connection.db.collection("users", async (err, users) => {
            try {
              const user = await users.findOne({
                email: session?.user.email,
              });
              const { _id: userID } = user;

              // Deleting all lists
              await Watchlist.deleteMany({
                user: session?.user,
              }).catch((err) => {
                console.error(
                  `Couldn't delete lists - user: ${JSON.stringify(
                    user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              });

              // Deleting all email subscriptions
              await Releasesemail.deleteMany({
                email: session?.user?.email,
              }).catch((err) => {
                console.error(
                  `Couldn't delete emails - user: ${JSON.stringify(
                    user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              });

              // Deleting all saved lists
              await Savedlist.deleteMany({
                user: session?.user,
              }).catch((err) => {
                console.error(
                  `Couldn't delete saved lists - user: ${JSON.stringify(
                    user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              });

              // Deleting all user sessions
              mongoose.connection.db.collection("sessions", (err, sessions) => {
                sessions
                  .deleteMany({
                    userId: userID,
                  })
                  .catch((err) => {
                    console.error(
                      `Couldn't delete sessions - user: ${JSON.stringify(
                        user
                      )} - ${JSON.stringify(err)}`
                    );
                    return res.status(400).json({ success: false });
                  });
              });

              // Deleting all user login provider accounts
              mongoose.connection.db.collection("accounts", (err, accounts) => {
                accounts
                  .findOneAndDelete({
                    userId: userID,
                  })
                  .catch((err) => {
                    console.error(
                      `Couldn't delete from accounts collection - user: ${JSON.stringify(
                        user
                      )} - ${JSON.stringify(err)}`
                    );
                    return res.status(400).json({ success: false });
                  });
              });

              // Deleting user
              const deletedUser = await users.findOneAndDelete({
                _id: userID,
              });
              if (!deletedUser.value) {
                console.error(
                  `User was not found - user: ${JSON.stringify(
                    user
                  )} - ${JSON.stringify(err)}`
                );
                return res.status(400).json({ success: false });
              }

              res.status(200).json({
                success: deletedUser.ok,
                data: deletedUser.value,
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

    default:
      console.error(
        `Wrong fetch method used for api/account/delete - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
