import { getSession } from "next-auth/client";
import mongoose from "mongoose";
import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        var { movieID, watched, movie } = req.body;

        // Adding movie to the "Watched" list
        var list;
        await Watchlist.findOne({
          user: session?.user,
          title: /^Watched$/i,
        }).then(async (res) => {
          if (res._doc) {
            ({ _doc: list } = res);
            var { movies } = list;

            if (movies.length > 0) {
              movie.position =
                movies.sort((a, b) => b.position - a.position)[0].position + 1;
            } else {
              movie.position = 0;
            }

            var ids = movies.map((mov) => mov.id);
            if (watched === "true" && !ids.includes(movieID)) {
              list = {
                ...list,
                movies: [...movies, { ...movie, watched: "true" }],
              };
            } else if (watched === "false" && ids.includes(movieID)) {
              list = {
                ...list,
                movies: [...movies.filter((mov) => mov.id !== movieID)],
              };
            }

            var updatedList = await Watchlist.findOneAndUpdate(
              {
                user: session?.user,
                title: /^Watched$/i,
              },
              list,
              {
                new: true,
                runValidators: true,
                timestamps: false,
              }
            );

            if (!updatedList) {
              console.error(
                `List not found - user: ${JSON.stringify(session?.user)}`
              );
            }
          }
        });

        // Updating movie to "watched" on all lists
        var updatedLists = await Watchlist.updateMany(
          {
            user: session?.user,
            "movies.id": movieID,
          },
          { "movies.$.watched": watched },
          {
            timestamps: false,
          }
        );

        if (!updatedLists) {
          console.error(
            `Lists not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }

        // Changing all episodes to "watched" if tv show
        if (movie.seasons?.length > 0) {
          var updatedLists2 = await Watchlist.updateMany(
            {
              user: session?.user,
              "movies.id": movieID,
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
                { episode: { $exists: true } },
              ],
              timestamps: false,
            }
          );

          if (!updatedLists2) {
            console.error(
              `Lists not found - user: ${JSON.stringify(session?.user)}`
            );
            return res.status(400).json({ success: false });
          }
        }

        res.status(200).json({ success: true, data: updatedLists });
      } catch (err) {
        console.error(
          `Couldn't update lists - ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        var { episodeID, watched } = req.body;

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
        );

        if (!updatedLists) {
          console.error(
            `Lists not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: updatedLists });
      } catch (err) {
        console.error(
          `Couldn't update lists - ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/watched/[id] - user: ${JSON.stringify(
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
