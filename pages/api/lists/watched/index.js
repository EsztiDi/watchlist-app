import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

import addToWatched from "../../../../utils/addToWatched";
import setWatched from "../../../../utils/setWatched";
import checkEpisodes from "../../../../utils/checkEpisodes";
import checkSeasons from "../../../../utils/checkSeasons";

export default async function handler(req, res) {
  var { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        var { watched, movieID, movie, listID } = req.body;
        var tv = movie?.seasons?.length > 0;

        // Adding movie to the "Watched" list
        await addToWatched(session?.user, movieID, watched, movie);

        // Updating movie to "watched"
        var updatedList = await setWatched(movieID, watched, tv, listID);

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

    case "PUT":
      try {
        var { watched, movieID, episodeID, season_number, listID } = req.body;

        // Updating episode to "watched"
        var updatedList = await Watchlist.findOneAndUpdate(
          {
            _id: listID,
            "movies.seasons.episodes.id": episodeID,
          },
          {
            $set: {
              "movies.$[movie].seasons.$[season].episodes.$[episode].watched":
                watched,
            },
          },
          {
            arrayFilters: [
              {
                "movie.seasons": { $exists: true },
              },
              { "season.episodes": { $exists: true } },
              { episode: { $exists: true }, "episode.id": episodeID },
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

        // Set season and show "watched" if all episodes are watched
        await checkEpisodes(movieID, season_number, listID);
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
        `Wrong fetch method used for api/lists/watched - user: ${JSON.stringify(
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
