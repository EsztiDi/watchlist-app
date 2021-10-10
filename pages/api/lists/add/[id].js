import { getSession } from "next-auth/client";

import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";
import getDetails from "../../../../utils/getDetails";
import setWatched from "../../../../utils/setWatched";

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
        var movie = req.body.release_date
          ? req.body
          : await getDetails(req.body);

        var { _doc: list } = await Watchlist.findById(id);
        var { movies } = list;

        if (movies.length > 0) {
          movie.position =
            movies.sort((a, b) => b.position - a.position)[0].position + 1;
        } else {
          movie.position = 0;
        }

        var ids = movies.map((mov) => mov.id);
        if (ids.includes(movie.id)) {
          list = {
            ...list,
            movies: [...movies.filter((mov) => mov.id !== movie.id)],
          };
        } else {
          list = { ...list, movies: [...movies, movie] };
        }

        var updatedList = await Watchlist.findByIdAndUpdate(id, list, {
          new: true,
          runValidators: true,
        }).catch((err) => console.error(err));

        if (!updatedList) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }

        // If adding to the "Watched" list, change movie to "watched"
        if (/^Watched$/i.test(list.title)) {
          var tv = movie.seasons?.length > 0;
          if (!ids.includes(movie.id)) {
            await setWatched(movie.id, "true", tv, id);
          }
        }

        res.status(200).json({ success: true, data: updatedList });
      } catch (err) {
        console.error(
          `Couldn't update list - ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/add/[id] - user: ${JSON.stringify(
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
