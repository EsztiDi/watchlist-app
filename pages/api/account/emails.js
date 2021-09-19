import { getSession } from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Releasesemail from "../../../models/Releasesemail";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const update = await Watchlist.updateMany(
          {
            user: session?.user,
            emails: true,
          },
          { emails: false },
          {
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!update) {
          console.error(
            `Couldn't perform updateMany() for emails in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }

        const deletedEmails = await Releasesemail.deleteMany({
          email: session?.user?.email,
        }).catch((err) => console.error(err));

        if (!deletedEmails) {
          console.error(
            `Couldn't perform deleteMany() in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
        }

        res
          .status(200)
          .json({ success: update.n === update.nModified, data: update });
      } catch (err) {
        console.error(
          `Couldn't perform updateMany() for emails in MongoDB - user: ${
            session?.user
          } - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/account/emails - user: ${JSON.stringify(
          session?.user
        )} - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
