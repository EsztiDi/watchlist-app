import { getSession } from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const update = await Watchlist.updateMany(
          {
            user: session.user,
            private: false,
          },
          { private: true }
        );

        if (!update) {
          console.error(
            `Couldn't perform updateMany() for public lists in MongoDB - user: ${JSON.stringify(
              session.user
            )}`
          );
          return res.status(400).json({ success: false });
        }

        res
          .status(200)
          .json({ success: update.n === update.nModified, data: update });
      } catch (err) {
        console.error(
          `Couldn't perform updateMany() for public lists in MongoDB - user: ${
            session.user
          } - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedLists = await Watchlist.deleteMany({
          user: session.user,
        });
        if (!deletedLists) {
          console.error(
            `Couldn't perform deleteMany() in MongoDB - user: ${JSON.stringify(
              session.user
            )}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({
          success: deletedLists.n === deletedLists.deletedCount,
          data: deletedLists,
        });
      } catch (err) {
        console.error(
          `Couldn't perform deleteMany() in MongoDB - user: ${
            session.user
          } - ${JSON.stringify(err)}`
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
