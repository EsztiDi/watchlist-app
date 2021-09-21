import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import getDetails from "../../../utils/getDetails";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        console.log("Running cron database update");

        const updates = await Watchlist.find()
          .then(async (lists) => {
            var movies = lists.reduce(
              (list1, list2) => [...list1, ...list2.movies],
              []
            );
            var uniques = movies
              .filter((movie) => movie.media_type === "movie")
              ?.filter(
                (e, i) => movies.findIndex((a) => a["id"] === e["id"]) === i
              );

            if (uniques.length > 0) {
              uniques.map(async (movie) => {
                var updatedMovie = await getDetails(movie);

                var updatedLists = await Watchlist.updateMany(
                  {
                    "movies.id": movie.id,
                  },
                  {
                    "movies.$.poster_path": updatedMovie.poster_path,
                    "movies.$.backdrop_path": updatedMovie.backdrop_path,
                    "movies.$.title": updatedMovie.title,
                    "movies.$.release_date": updatedMovie.release_date,
                    "movies.$.year": updatedMovie.year,
                    "movies.$.overview": updatedMovie.overview,
                    "movies.$.details": updatedMovie.details,
                  },
                  {
                    timestamps: false,
                  }
                ).catch((err) => console.error(err));

                if (!updatedLists) {
                  console.error(`Couldn't update movies with updateMany.`);
                  return res.status(400).json({ success: false });
                }
              });
            }

            return await Promise.all(
              lists.map(async (list) => {
                if (list.movies.length > 0) {
                  var originalList = JSON.stringify(list);

                  list.movies = await Promise.all(
                    list.movies.map(async (movie) => {
                      if (movie.media_type === "tv") {
                        return await getDetails(movie);
                      } else {
                        return movie;
                      }
                    })
                  );

                  if (originalList !== JSON.stringify(list)) {
                    return await list
                      .save()
                      .then(() => {
                        return 1;
                      })
                      .catch((err) => {
                        console.error(
                          `Error saving watchlist - ${
                            list._id
                          } - ${JSON.stringify(err)}`
                        );
                        return 0;
                      });
                  } else {
                    return 0;
                  }
                } else {
                  return 0;
                }
              })
            );
          })
          .catch((err) => {
            console.error(
              `Couldn't update watchlist collection - ${JSON.stringify(err)}`
            );
          });

        var count = updates.reduce((a, b) => a + b, 0);
        console.log(
          `Update done - At least ${count} ${
            count === 1 ? "list" : "lists"
          } updated ^^`
        );

        res.status(200).json({
          success: true,
          data: `At least ${count} ${count === 1 ? "list" : "lists"} updated`,
        });
      } catch (err) {
        console.error(
          `Couldn't perform daily cron update - ${JSON.stringify(err)}`
        );
        res
          .status(400)
          .json({ success: false, data: `${JSON.stringify(err)}` });
      }
      break;

    default:
      console.error(`Wrong fetch method used for api/cron/daily - ${method}`);
      break;
  }
}
