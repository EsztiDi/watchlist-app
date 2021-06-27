import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const getDetails = async (movie) => {
          var baseURL = "https://api.themoviedb.org/3";
          var url = `/${movie.media_type}/${movie.id}`;
          var api_key = process.env.TMDB_API_KEY;
          var params =
            "&append_to_response=credits,external_ids&include_adult=false";
          var fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
          var options = {
            headers: {
              Authorization: process.env.TMDB_BEARER,
              "Content-Type": "application/json;charset=utf-8",
            },
          };

          return await fetch(fullUrl, options)
            .then((res) => res.json())
            .then(async (data) => {
              var updatedMovie =
                movie.media_type === "tv"
                  ? {
                      ...movie,
                      poster_path: data.poster_path,
                      backdrop_path: data.backdrop_path,
                      title: data.name,
                      release_date: data.first_air_date,
                      overview: data.overview,
                      details: {
                        genres: data.genres,
                        // runtime: data.runtime,
                        episode_run_time: data.episode_run_time,
                        next_episode_to_air: data.next_episode_to_air,
                        last_episode_to_air: data.last_episode_to_air,
                        last_air_date: data.last_air_date,
                        number_of_episodes: data.number_of_episodes,
                        created_by: data.created_by,
                        credits: data.credits,
                        vote_average: data.vote_average,
                        external_ids: data.external_ids,
                      },
                    }
                  : {
                      ...movie,
                      poster_path: data.poster_path,
                      backdrop_path: data.backdrop_path,
                      title: data.title,
                      release_date: data.release_date,
                      overview: data.overview,
                      details: {
                        genres: data.genres,
                        runtime: data.runtime,
                        credits: data.credits,
                        vote_average: data.vote_average,
                        external_ids: data.external_ids,
                      },
                    };

              if (movie.media_type === "tv" && data.number_of_seasons) {
                var seasons = [];

                for (
                  let season = 1;
                  season <= data.number_of_seasons;
                  season++
                ) {
                  url = `/tv/${movie.id}/season/${season}`;
                  params = "";
                  fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;

                  await fetch(fullUrl, options)
                    .then((res) => res.json())
                    .then((data) => {
                      seasons.push(data);
                    })
                    .catch((err) => {
                      console.error(
                        `Season details error - movie: ${movie.id} - ${err}`
                      );
                      (!data || data.length === 0) &&
                        console.error(
                          `Couldn't get details - movie: ${movie.id} - data: ${data}`
                        );
                    });
                }
                return { ...updatedMovie, seasons };
              } else {
                return updatedMovie;
              }
            })
            .catch((err) => {
              console.error(
                `Error fetching details - movie: ${movie.id} - ${err}`
              );
            });
        };

        console.log("Running cron database update");

        const updates = await Watchlist.find()
          .then(async (lists) => {
            return await Promise.all(
              lists.map(async (list) => {
                if (list.movies.length > 0) {
                  list.movies = await Promise.all(
                    list.movies.map(async (movie) => {
                      return await getDetails(movie);
                    })
                  );

                  return await list
                    .save()
                    .then(() => {
                      console.log(`${list._id} - saved`);
                      return 1;
                    })
                    .catch((err) => {
                      console.error(
                        `Error saving watchlist - ${list._id} - ${err}`
                      );
                    });
                } else {
                  return 0;
                }
              })
            );
          })
          .catch((err) => {
            console.error(`Couldn't update watchlist collection - ${err}`);
          });

        var count = updates.reduce((a, b) => a + b, 0);
        console.log(
          `Update done - ${count} ${count === 1 ? "list" : "lists"} updated ^^`
        );

        res.status(200).json({
          success: true,
          data: `${count} ${count === 1 ? "list" : "lists"} updated`,
        });
      } catch (err) {
        console.error(`Couldn't perform daily cron update - ${err}`);
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(`Wrong fetch method used for api/cron/daily - ${method}`);
      break;
  }
}
