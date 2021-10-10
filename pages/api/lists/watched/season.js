import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";
import checkSeasons from "../../../../utils/checkSeasons";

export default async function handler(req, res) {
  var { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        var { watched, movieID, season_number, listID } = req.body;

        // Updating season and all episodes to "watched"
        var updatedList = await Watchlist.findOneAndUpdate(
          {
            _id: listID,
            "movies.id": movieID,
          },
          {
            $set: {
              "movies.$[movie].seasons.$[season].watched": watched,
              "movies.$[movie].seasons.$[season].episodes.$[episode].watched":
                watched,
            },
          },
          {
            arrayFilters: [
              {
                "movie.seasons": { $exists: true },
                "movie.id": movieID,
              },
              {
                "season.episodes": { $exists: true },
                "season.season_number": season_number,
              },
              { episode: { $exists: true } },
            ],

            new: true,
            runValidators: true,
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedList) {
          console.error(`List not found - ${listID}`);
          return res.status(400).json({ success: false });
        }
        // }

        // Set show "watched" if all seasons are watched
        await checkSeasons(session?.user, movieID, listID);

        res.status(200).json({ success: true, data: updatedList });
      } catch (err) {
        console.error(
          `Couldn't update lists - movie: ${movieID} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/watched/season - user: ${JSON.stringify(
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
