import updateChanges from "./updateChanges";
import Watchlist from "../models/Watchlist";

export default async function addToWatched(user, id, watched, movie) {
  var tv = movie?.seasons?.length > 0;
  var list;
  await Watchlist.findOne({
    "user.email": user?.email,
    title: /^Watched$/i,
  })
    .then(async (res) => {
      if (res?._doc) {
        ({ _doc: list } = res);
        var { movies } = list;

        if (movie) {
          if (movies.length > 0) {
            movie.position =
              movies.sort((a, b) => b.position - a.position)[0].position + 1;
          } else {
            movie.position = 0;
          }
        }

        var ids = movies.map((mov) => mov.id);
        if (watched === "true" && movie && !ids?.includes(id)) {
          list = {
            ...list,
            movies: [...movies, { ...movie, watched: "true" }],
          };
        } else if (watched === "false" && ids?.includes(id)) {
          list = {
            ...list,
            movies: [...movies.filter((mov) => mov.id !== id)],
          };
        }

        var updatedList = await Watchlist.findOneAndUpdate(
          {
            "user.email": user?.email,
            title: /^Watched$/i,
          },
          list,
          {
            new: true,
            runValidators: true,
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!updatedList) {
          console.error(`List not found - user: ${JSON.stringify(user)}`);
        }

        // Add info to change log
        if (watched === "true" && movie && !ids?.includes(id)) {
          await updateChanges(
            updatedList?._id,
            { action: "added", change: movie?.title },
            user?.name
          );
        } else if (watched === "false" && ids?.includes(id)) {
          await updateChanges(
            updatedList?._id,
            { action: "removed", change: movie?.title },
            user?.name
          );
        }
      }
    })
    .catch((err) => console.error(err));

  // Changing all seasons and episodes to "watched" if tv show
  if (tv) {
    var updatedList2 = await Watchlist.findOneAndUpdate(
      { "user.email": user?.email, title: /^Watched$/i },
      {
        $set: {
          "movies.$[movie].seasons.$[season].watched": watched,
          "movies.$[movie].seasons.$[season].episodes.$[episode].watched":
            watched,
        },
      },
      {
        arrayFilters: [
          {
            "movie.seasons": { $exists: true },
            "movie.id": movie?.id,
          },
          {
            season: { $exists: true },
            "season.episodes": { $exists: true },
          },
          { episode: { $exists: true } },
        ],
        new: true,
        runValidators: true,
        timestamps: false,
      }
    ).catch((err) => console.error(err));

    if (!updatedList2) {
      console.error(`List not found - user: ${JSON.stringify(user)}`);
    }
  }
}
