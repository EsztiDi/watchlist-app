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
        const lists = await Watchlist.find({}).sort({ position: 1 });
        res.status(200).json({ success: true, data: lists });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const lists = await Watchlist.find({}).sort({ position: 1 });

        if (lists.length > 0) {
          req.body.position = lists[lists.length - 1].position + 1;
        } else {
          req.body.position = 0;
        }
        req.body.user = session.user;

        const list = await Watchlist.create(req.body);
        res.status(201).json({ success: true, data: list });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
