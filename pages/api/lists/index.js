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
        const lists = await Watchlist.find(
          { user: session?.user },
          "_id title movies position"
        ).sort({
          position: -1,
        });
        res.status(200).json({ success: true, data: lists });
      } catch (err) {
        console.error(
          `Lists not found -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        if (session) {
          const lists = await Watchlist.find({ user: session?.user }).sort({
            position: -1,
          });

          if (lists.length > 0) {
            req.body.position = lists[0].position + 1;
          } else {
            req.body.position = 0;
          }
          req.body.user = session?.user;
        }

        const list = await Watchlist.create(req.body).catch((err) =>
          console.error(err)
        );
        res.status(201).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't create list -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/lists - user: ${JSON.stringify(
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
