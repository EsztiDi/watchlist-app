export default function formatData(movie) {
  var { release_date, details } = movie;

  if (details) {
    var {
      genres,
      runtime,
      episode_run_time,
      next_episode_to_air,
      last_episode_to_air,
      last_air_date,
      created_by,
      credits,
    } = details;
  }

  // Getting the last season's number for Season modal
  if (next_episode_to_air || last_episode_to_air)
    var { season_number } = next_episode_to_air || last_episode_to_air;

  // Year for the title part
  var year = release_date
    ? new Date(release_date).getFullYear()
    : "No release date";

  // Date for the info part
  if (next_episode_to_air) var { air_date } = next_episode_to_air;
  var tv_date = air_date ? air_date : last_air_date;

  release_date = tv_date
    ? new Date(tv_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : release_date
    ? new Date(release_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  // Getting directors or creators
  var directors = credits.crew.filter((member) => member.job === "Director");
  // }
  directors = getNames(directors); // Returns an array with the names

  var creators, cast;

  // Fallback option for tv shows without created_by array
  created_by && created_by.length === 0
    ? (creators =
        credits.crew.filter((member) => member.job === "Comic Book").length > 0
          ? credits.crew.filter((member) => member.job === "Comic Book")
          : credits.crew.filter(
              (member) => member.job === "Executive Producer"
            ))
    : (creators = created_by);

  creators = getNames(creators);

  // Getting cast
  cast = getNames(credits.cast);

  // Getting average run time for series
  if (episode_run_time) {
    episode_run_time = Math.floor(
      episode_run_time.reduce((a, b) => a + b, 0) / episode_run_time.length
    );
  }

  // Getting run time in hours and mins
  runtime = runtime
    ? getRuntime(runtime)
    : episode_run_time
    ? getRuntime(episode_run_time)
    : "";

  // Getting genres in one string
  genres && genres.length > 0
    ? (genres = genres
        .map((genre, index) =>
          index === genres.length - 1 ? genre.name : genre.name + " | "
        )
        .join(""))
    : (genres = "");

  delete movie.details.created_by;
  delete movie.details.credits;

  return {
    ...movie,
    release_date,
    year,
    details: {
      ...details,
      season_number,
      directors,
      creators,
      cast,
      runtime,
      genres,
    },
  };
}

function getNames(arr) {
  arr && arr.length > 0
    ? (arr = arr
        .map((member, index) =>
          index === arr.length - 1 ? member.name : member.name + ", "
        )
        .join(""))
    : (arr = "");

  return arr;
}

function getRuntime(total) {
  let hours = Math.floor(total / 60),
    mins = total % 60;
  total =
    hours > 0 && mins > 0
      ? `${hours}h ${mins}m`
      : hours > 0
      ? `${hours}h`
      : `${total}m`;

  return total;
}
