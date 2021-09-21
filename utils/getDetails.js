import getLocalDate from "./getLocalDate";
import formatData from "./formatData";

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
var getEpisodes = (obj, seasons) =>
  obj?.episodes?.map((ep) => {
    let episode = seasons
      ?.filter((season) => season.season_number === ep.season_number)[0]
      ?.episodes?.filter((e) => e.episode_number === ep.episode_number)[0];

    return {
      id: ep.id,
      episode_number: ep.episode_number,
      air_date: ep.air_date,
      name: ep.name,
      overview: ep.overview,
      still_path: ep.still_path,
      season_number: ep.season_number,
      watched: episode?.watched || "false",
    };
  });
var getSeasonWatched = (arr, num) => {
  return arr?.filter((season) => season.season_number === num)[0]?.watched;
};

export default async function getDetails(movie) {
  var { release_date, locale } = await getLocalDate(
    movie,
    movie.locale ? movie.locale : null
  );

  var baseURL = "https://api.themoviedb.org/3";
  var api_key = process.env.TMDB_API_KEY;
  var options = {
    headers: {
      Authorization: process.env.TMDB_BEARER,
      "Content-Type": "application/json;charset=utf-8",
    },
  };
  var url = `/${movie.media_type}/${movie.id}`;
  var params = "&append_to_response=credits,external_ids&include_adult=false";
  var fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;

  return await fetch(fullUrl, options)
    .then((res) => res.json())
    .then(async (data) => {
      var updatedMovie =
        movie.media_type === "tv"
          ? {
              ...movie,
              locale: locale,
              watched: movie.watched || "false",
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
              locale: locale,
              watched: movie.watched || "false",
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
                episodes: getEpisodes(data, movie.seasons) || [],
                season_number: data?.season_number,
                watched:
                  getSeasonWatched(movie.seasons, data?.season_number) ||
                  "false",
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
