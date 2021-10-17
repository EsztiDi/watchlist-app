import { getSession } from "next-auth/client";

import getLocalDate from "../../../utils/getLocalDate";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      // Identify the original incoming request's location
      var ip =
        req.headers["x-forwarded-for"]?.split(",").shift() ||
        req.socket?.remoteAddress;

      await fetch(`https://ipinfo.io/${ip}/json?token=ce08a565a65fd0`)
        .then((res) => res.json())
        .then((data) => {
          res.status(200).json({ success: true, data: data?.country || "US" });
        })
        .catch((err) => {
          console.error(`Error fetching locale ${JSON.stringify(err)}`);
          res.status(400).json({ success: false });
        });

      break;

    case "PUT":
      try {
        var { loc } = req.body;

        var updatedLists = await Watchlist.updateMany(
          {
            user: session?.user,
          },
          {
            $set: {
              "movies.$[movie].locale": loc,
            },
          },
          {
            arrayFilters: [
              {
                "movie.locale": { $exists: true },
              },
            ],
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedLists) {
          console.error(`Couldn't update locale with updateMany.`);
          return res.status(400).json({ success: false });
        }

        // Update local release date on all lists
        const updates = await Watchlist.find({
          user: session?.user,
        })
          .then(async (lists) => {
            var movies = lists.reduce(
              (list1, list2) => [...list1, ...list2.movies],
              []
            );
            var uniques = movies
              .filter((movie) => movie.media_type === "movie")
              ?.filter(
                (movie, index, array) =>
                  array.findIndex((el) => el.id === movie.id) === index
              );

            if (uniques.length > 0) {
              return await Promise.all(
                uniques.map(async (movie) => {
                  var { release_date } = await getLocalDate(movie, loc);

                  var updatedLists2 = await Watchlist.updateMany(
                    {
                      user: session?.user,
                      "movies.id": movie.id,
                    },
                    {
                      "movies.$.release_date": release_date,
                      "movies.$.year": new Date(release_date).getFullYear(),
                    },
                    {
                      timestamps: false,
                    }
                  ).catch((err) => console.error(err));

                  if (!updatedLists2) {
                    console.error(`Couldn't update movies with updateMany.`);
                    return res.status(400).json({ success: false });
                  }
                  return updatedLists2;
                })
              );
            }
          })
          .catch((err) => {
            console.error(`Couldn't find watchlists - ${JSON.stringify(err)}`);
          });

        // if (!updates) {
        //   console.error(
        //     `Lists not found - user: ${JSON.stringify(session?.user)}`
        //   );
        //   return res.status(400).json({ success: false });
        // }
        res.status(200).json({ success: true, data: updates });
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
        `Wrong fetch method used for api/account/locale - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
