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
      if (movie?.seasons?.length > 0) {
        var watched = movie?.seasons?.every(
          (season) => season.watched === "true"
        );

        if (watched) {
          await addToWatched(user, movieID, "true", movie); // Adding movie to the "Watched" list
        } else {
          // Checking if all episodes watched: "false"
          var noneWatched = movie?.seasons?.every(
            (season) => season.watched === "false"
          );
          if (noneWatched) {
            var episodes = movie?.seasons?.slice(0).map((season) => {
              return (
                season?.episodes?.length > 0 &&
                season?.episodes?.every(
                  (episode) => episode.watched === "false"
                )
              );
            });
            var noEpisode = !episodes?.includes(false);
            if (noEpisode) {
              await addToWatched(user, movieID, "false", movie); // Removing movie from the "Watched" list
            }
          }
        }

        var updatedLists3 = await Watchlist.updateMany(
          {
            user: user,
            "movies.id": movieID,
          },
          { "movies.$.watched": watched.toString() },
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
