import Watchlist from "../models/Watchlist";
import addToWatched from "./addToWatched";

// Updates tv show to "watched" if all seasons are watched
export default async function checkSeasons(user, movieID, listID) {
  await Watchlist.findOne({
    _id: listID,
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

        var updatedList = await Watchlist.findOneAndUpdate(
          {
            _id: listID,
            "movies.id": movieID,
          },
          { "movies.$.watched": watched.toString() },
          {
            new: true,
            runValidators: true,
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedList) {
          console.error(`List not found - ${listID}`);
          return res.status(400).json({ success: false });
        }
      }
    })
    .catch((err) => console.error(err));
}
