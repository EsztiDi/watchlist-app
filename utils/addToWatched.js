import Watchlist from "../models/Watchlist";

export default async function addToWatched(user, id, watched, movie = null) {
  var list;
  await Watchlist.findOne({
    user: user,
    title: /^Watched$/i,
  })
    .then(async (res) => {
      if (res._doc) {
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
        if (watched === "true" && movie && !ids.includes(id)) {
          list = {
            ...list,
            movies: [...movies, { ...movie, watched: "true" }],
          };
        } else if (watched === "false" && ids.includes(id)) {
          list = {
            ...list,
            movies: [...movies.filter((mov) => mov.id !== id)],
          };
        }

        var updatedList = await Watchlist.findOneAndUpdate(
          {
            user: user,
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
      }
    })
    .catch((err) => console.error(err));
}
