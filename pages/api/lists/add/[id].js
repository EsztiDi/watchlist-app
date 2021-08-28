import { getSession } from "next-auth/client";

import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";
import getDetails from "../../../../utils/getDetails";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        var movie = await getDetails(req.body);
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
        });

        if (!updatedList) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: updatedList });
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
