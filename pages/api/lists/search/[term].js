import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { term },
    method,
  } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const results = await Watchlist.aggregate([
          {
            $search: {
              search: {
                query: decodeURIComponent(term),
                path: [
                  "title",
                  "movies.title",
                  "movies.overview",
                  "movies.release_date",
                  "movies.details.genres",
                  "movies.details.directors",
                  "movies.details.creators",
                  "movies.details.cast",
                ],
              },
            },
          },
          {
            $limit: 20,
          },
          {
            $project: {
              emails: 0,
              position: 0,
            },
          },
        ]);

        res.status(200).json({
          success: true,
          data: results.filter((list) => list.private === false),
        });
      } catch (err) {
        console.error(`Lists not found - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/lists/search/[term] - ${method}`
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
