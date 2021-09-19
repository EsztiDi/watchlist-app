import Watchlist from "../models/Watchlist";
import addToWatched from "./addToWatched";

// Updates tv show to "watched" if all seasons are watched
export default async function checkSeasons(user, movieID) {
  await Watchlist.findOne({
    user: user,
    "movies.id": movieID,
  })
    .then(async (list) => {
      var movie = list?.movies?.filter((movie) => movie.id === movieID)[0];
      var seasons = movie?.seasons?.filter(
        (season) => season.watched === "false"
      );
      // Checking if all episodes watched: "false"
      var episodeCount;
      if (seasons?.length !== 0) {
        var watchedSeasons = movie?.seasons
          ?.slice(0)
          .filter((season) => season.watched === "true");
        if (watchedSeasons?.length === 0) {
          var episodes = movie?.seasons
            ?.slice(0)
            .map(
              (season) =>
                season?.episodes?.filter(
                  (episode) => episode.watched === "true"
                )?.length
            );
          episodeCount = episodes?.reduce((a, b) => a + b, 0);
        }
      }

      if (seasons) {
        var watched = seasons.length === 0 ? "true" : "false";

        if (watched === "true") {
          await addToWatched(user, movieID, watched, movie); // Adding movie to the "Watched" list
        }
        if (episodeCount === 0) {
          await addToWatched(user, movieID, "false", movie); // Removing movie from the "Watched" list
        }

        var updatedLists3 = await Watchlist.updateMany(
          {
            user: user,
            "movies.id": movieID,
          },
          { "movies.$.watched": watched },
          {
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedLists3) {
          console.error(`Lists not found - user: ${JSON.stringify(user)}`);
          return res.status(400).json({ success: false });
        }
      }
    })
    .catch((err) => console.error(err));
}
