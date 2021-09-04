import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const publicLists = await Watchlist.find(
          { private: false, "movies.0": { $exists: true } },
          "_id title movies user",
          {
            skip: 0,
            limit: 8,
            sort: {
              updatedAt: -1,
            },
          }
        );
        res.status(200).json({ success: true, data: publicLists });
      } catch (err) {
        console.error(`Lists not found - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(`Wrong fetch method used for api/lists/public - ${method}`);
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
