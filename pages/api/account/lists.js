import { getSession } from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Releasesemail from "../../../models/Releasesemail";
import Savedlist from "../../../models/Savedlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // Sets all lists private
        const update = await Watchlist.updateMany(
          {
            "user.email": session?.user?.email,
            private: false,
          },
          { private: true },
          {
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!update) {
          console.error(
            `Couldn't perform updateMany() for public lists in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }

        res
          .status(200)
          .json({ success: update.n === update.nModified, data: update });
      } catch (err) {
        console.error(
          `Couldn't perform updateMany() for public lists in MongoDB - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        // Deleting all lists
        const deletedLists = await Watchlist.deleteMany({
          "user.email": session?.user?.email,
        }).catch((err) => console.error(err));
        if (!deletedLists) {
          console.error(
            `Couldn't perform deleteMany() for lists in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }

        // Deleting all subscriptions
        const deletedEmails = await Releasesemail.deleteMany({
          email: session?.user?.email,
          savedList: false,
        }).catch((err) => console.error(err));

        if (!deletedEmails) {
          console.error(
            `Couldn't perform deleteMany() for emails in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
        }

        // Deleting lists for others if saved
        await Savedlist.deleteMany({
          "creator.email": session?.user?.email,
        }).catch((err) => {
          console.error(
            `Couldn't delete saved lists for others - user: ${JSON.stringify(
              user
            )} - ${JSON.stringify(err)}`
          );
          return res.status(400).json({ success: false });
        });

        res.status(200).json({
          success: deletedLists.n === deletedLists.deletedCount,
          data: deletedLists,
        });
      } catch (err) {
        console.error(
          `Couldn't delete lists - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/account/lists - user: ${JSON.stringify(
          session?.user
        )} - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
