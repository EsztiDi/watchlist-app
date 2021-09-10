import formatData from "./formatData";

export default async function getDetails(movie) {
  var release_date;
  var country = movie.country || "US";
  if (process.env.NODE_ENV !== "development" && movie.media_type === "movie")
    await fetch(
      `https://ipinfo.io/country?token=${process.env.APINFO_TOKEN}`
    ).then((data) => {
      country = movie.country ? movie.country : data || "US";
    });

  var baseURL = "https://api.themoviedb.org/3";
  var api_key = process.env.TMDB_API_KEY;
  var options = {
    headers: {
      Authorization: process.env.TMDB_BEARER,
      "Content-Type": "application/json;charset=utf-8",
    },
  };

  if (movie.media_type === "movie") {
    var url = `/${movie.media_type}/${movie.id}/release_dates`;
    var fullUrl = `${baseURL}${url}?api_key=${api_key}`;
    await fetch(fullUrl, options)
      .then((res) => res.json())
      .then((data) => {
        release_date = data?.results
          ?.filter((date) => date.iso_3166_1 === country)[0]
          ?.release_dates?.filter(
            (date) => date.type === 3 || date.type === 2
          )[0]?.release_date;
      });
  }

  var url = `/${movie.media_type}/${movie.id}`;
  var params = "&append_to_response=credits,external_ids&include_adult=false";
  var fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;

  var getCrew = (obj) =>
    obj?.credits?.crew
      ?.filter(
        (member) =>
          member.job === "Director" ||
          member.job === "Comic Book" ||
          member.job === "Executive Producer"
      )
      ?.map((member) => {
        return { job: member.job, name: member.name };
      });
  var getCast = (obj) =>
    obj?.credits?.cast?.map((member) => {
      return { name: member.name };
    });
  var getCreators = (obj) =>
    obj?.created_by?.map((member) => {
      return { name: member.name };
    });
  var getEpisodes = (obj) =>
    obj?.episodes?.map((ep) => {
      return {
        id: ep.id,
        episode_number: ep.episode_number,
        air_date: ep.air_date,
        name: ep.name,
        overview: ep.overview,
        still_path: ep.still_path,
        season_number: ep.season_number,
      };
    });

  return await fetch(fullUrl, options)
    .then((res) => res.json())
    .then(async (data) => {
      var updatedMovie =
        movie.media_type === "tv"
          ? {
              ...movie,
              poster_path: data?.poster_path,
              backdrop_path: data?.backdrop_path,
              title: data?.name,
              release_date: data?.first_air_date,
              overview: data?.overview,
              details: {
                genres: data?.genres,
                episode_run_time: data?.episode_run_time,
                next_episode_to_air: {
                  season_number: data?.next_episode_to_air?.season_number,
                  episode_number: data?.next_episode_to_air?.episode_number,
                  air_date: data?.next_episode_to_air?.air_date,
                },
                last_episode_to_air: {
                  season_number: data?.last_episode_to_air?.season_number,
                },
                last_air_date: data?.last_air_date,
                number_of_episodes: data?.number_of_episodes,
                created_by: getCreators(data) || [],
                credits: {
                  crew: getCrew(data) || [],
                  cast: getCast(data) || [],
                },
                vote_average: data?.vote_average,
                external_ids: { imdb_id: data?.external_ids?.imdb_id || "" },
              },
            }
          : {
              ...movie,
              country: country,
              poster_path: data?.poster_path,
              backdrop_path: data?.backdrop_path,
              title: data?.title,
              release_date: release_date || data?.release_date,
              overview: data?.overview,
              details: {
                genres: data?.genres,
                runtime: data?.runtime,
                credits: {
                  crew: getCrew(data) || [],
                  cast: getCast(data) || [],
                },
                vote_average: data?.vote_average,
                external_ids: { imdb_id: data?.external_ids?.imdb_id || "" },
              },
            };

      if (movie.media_type === "tv" && data?.number_of_seasons > 0) {
        var seasons = [];

        for (let season = 1; season <= data?.number_of_seasons; season++) {
          url = `/tv/${movie.id}/season/${season}`;
          params = "";
          fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;

          await fetch(fullUrl, options)
            .then((res) => res.json())
            .then((data) => {
              seasons.push({
                episodes: getEpisodes(data) || [],
                season_number: data?.season_number,
              });
            })
            .catch((err) => {
              console.error(
                `Season details error - movie: ${movie.id} - ${JSON.stringify(
                  err
                )}`
              );
              (!data || data.length === 0) &&
                console.error(
                  `Couldn't get details - movie: ${movie.id} - data: ${data}`
                );
            });
        }
        return formatData({ ...updatedMovie, seasons });
      } else {
        return formatData(updatedMovie);
      }
    })
    .catch((err) => {
      console.error(
        `Error fetching details - movie: ${movie.id} - ${JSON.stringify(err)}`
      );
    });
}
