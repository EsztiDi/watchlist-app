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
            emails: true,
          },
          { emails: false }
        );

        if (!update) {
          console.error(
            `Couldn't perform updateMany() for emails in MongoDB - ${session.user}`
          );
          return res.status(400).json({ success: false });
        }

        res
          .status(200)
          .json({ success: update.n === update.nModified, data: update });
      } catch (error) {
        console.error(
          `Couldn't perform updateMany() for emails in MongoDB - ${session.user} - ${error}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/account/emails - ${session.user}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
