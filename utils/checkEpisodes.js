import Watchlist from "../models/Watchlist";

// Updates season to "watched" if all episodes are watched
export default async function checkEpisodes(user, movieID, season_number) {
  await Watchlist.findOne({
    user: user,
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

        var updatedLists3 = await Watchlist.updateMany(
          {
            user: user,
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
