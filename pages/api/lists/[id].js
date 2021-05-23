import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const list = await Watchlist.findById(id);
        if (!list) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const list = await Watchlist.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!list) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedList = await Watchlist.findByIdAndDelete(id);
        if (!deletedList) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedList });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
