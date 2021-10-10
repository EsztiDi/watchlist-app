import Watchlist from "../models/Watchlist";

// Updates season to "watched" if all episodes are watched
export default async function checkEpisodes(movieID, season_number, listID) {
  await Watchlist.findOne({
    _id: listID,
    "movies.id": movieID,
  })
    .then(async (list) => {
      var movie = list?.movies?.filter((movie) => movie.id === movieID)[0];
      if (movie?.seasons?.length > 0) {
        var season = movie?.seasons?.filter(
          (season) => season.season_number === season_number
        )[0];
        var watched =
          season?.episodes?.length > 0 &&
          season?.episodes?.every((episode) => episode.watched === "true");

        var updatedList = await Watchlist.findOneAndUpdate(
          {
            _id: listID,
            "movies.id": movieID,
          },
          {
            $set: {
              "movies.$[movie].seasons.$[season].watched": watched.toString(),
            },
          },
          {
            arrayFilters: [
              {
                "movie.seasons": { $exists: true },
                "movie.id": movieID,
              },
              {
                "season.episodes": { $exists: true },
                "season.season_number": season_number,
              },
            ],
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
