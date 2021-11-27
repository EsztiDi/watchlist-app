import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  var db = await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (db) {
          const list = await Watchlist.findById(id, "shared").catch((err) =>
            console.error(err)
          );
          if (!list) {
            console.error(`List ${id} not found`);
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: list?.shared });
        } else {
          res.status(200).json({ success: true, data: false });
        }
      } catch (err) {
        console.error(`List ${id} not found - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/shared/[id] - user: ${id} - ${method}`
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
