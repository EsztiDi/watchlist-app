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

        const movieUpdates = await Watchlist.find()
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
                  )
                    .then(() => {
                      return 1;
                    })
                    .catch((err) => console.error(err));

                  if (!updatedLists) {
                    console.error(`Couldn't update movies with updateMany.`);
                    return res.status(400).json({ success: false });
                  }
                  return updatedLists;
                })
              );
            }
          })
          .catch((err) => {
            console.error(`Couldn't find watchlists - ${JSON.stringify(err)}`);
          });

        const tvUpdates = await Watchlist.find()
          .then(async (lists) => {
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
            console.error(`Couldn't find watchlists - ${JSON.stringify(err)}`);
          });

        var count = tvUpdates?.reduce((a, b) => a + b, 0);
        console.log(
          `Update done - ${movieUpdates?.length} movies and ${count} lists with tv shows updated ^^`
        );

        res.status(200).json({
          success: true,
          data: `${movieUpdates?.length} movies and ${count} lists with tv shows updated`,
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
