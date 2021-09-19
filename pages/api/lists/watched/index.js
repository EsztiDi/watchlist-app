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
        var { watched, movieID, movie } = req.body;
        var tv = movie?.seasons?.length > 0;

        // Adding movie to the "Watched" list
        await addToWatched(session?.user, movieID, watched, movie);

        // Updating movie to "watched" on all lists
        var { updated } = await setWatched(session?.user, movieID, watched, tv);

        res.status(200).json({ success: true, data: updated });
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
        var { watched, movieID, episodeID, season_number } = req.body;

        // Updating episode to "watched" on all lists
        var updatedLists = await Watchlist.updateMany(
          {
            user: session?.user,
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
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedLists) {
          console.error(
            `Lists not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }

        // Set season and show "watched" if all episodes are watched
        await checkEpisodes(session?.user, movieID, season_number);
        await checkSeasons(session?.user, movieID);

        res.status(200).json({ success: true, data: updatedLists });
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
