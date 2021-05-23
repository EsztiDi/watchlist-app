export default function formatData(movie) {
  var { release_date, details } = movie;

  if (details) {
    var {
      runtime,
      episode_run_time,
      next_episode_to_air,
      last_episode_to_air,
      last_air_date,
      created_by,
      credits,
    } = details;
  }

  if (next_episode_to_air || last_episode_to_air)
    var { season_number } = next_episode_to_air || last_episode_to_air;

  if (next_episode_to_air) var { air_date } = next_episode_to_air;

  var tv_date = air_date ? air_date : last_air_date;

  tv_date = tv_date
    ? new Date(tv_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  var year = release_date
    ? new Date(release_date).getFullYear()
    : "No release date";

  release_date = release_date
    ? new Date(release_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No release date";

  if (credits && credits.hasOwnProperty("crew") && credits.crew.length > 0)
    var directors = credits.crew.filter((member) => member.job === "Director");

  var creators, cast;

  created_by && created_by.length === 0
    ? (creators = credits.crew.filter((member) => member.job === "Comic Book"))
    : (creators = created_by);

  credits && credits.hasOwnProperty("cast") && credits.cast.length > 0
    ? (cast = credits.cast.map((member, index) =>
        index === credits.cast.length - 1 ? member.name : member.name + ", "
      ))
    : (cast = "-");

  if (episode_run_time)
    episode_run_time = Math.floor(
      episode_run_time.reduce((a, b) => a + b, 0) / episode_run_time.length
    );

  if (runtime || episode_run_time) {
    let hours = Math.floor(runtime / 60),
      mins = runtime % 60;
    let ep_hours = Math.floor(episode_run_time / 60),
      ep_mins = episode_run_time % 60;
    runtime =
      hours > 0 && mins > 0
        ? `${hours}h ${mins}m`
        : hours > 0
        ? `${hours}h`
        : ep_hours > 0 && ep_mins > 0
        ? `${ep_hours}h ${ep_mins}m`
        : ep_hours > 0
        ? `${ep_hours}h`
        : episode_run_time
        ? `${episode_run_time}m`
        : runtime
        ? `${runtime}m`
        : 0;
  }

  return {
    ...movie,
    release_date,
    year,
    details: {
      ...details,
      tv_date,
      release_date,
      season_number,
      directors,
      creators,
      cast,
      runtime,
    },
  };
}
