import Watchlist from "../models/Watchlist";

export default async function setWatched(user, movieID, watched, tv) {
  // Updating movie to "watched" on all lists
  var updatedLists = await Watchlist.updateMany(
    {
      user: user,
      "movies.id": movieID,
    },
    { "movies.$.watched": watched },
    {
      timestamps: false,
    }
  ).catch((err) => console.error(err));

  if (!updatedLists) {
    console.error(`Lists not found - user: ${JSON.stringify(user)}`);
    return res.status(400).json({ success: false });
  }

  // Changing all seasons and episodes to "watched" if tv show
  if (tv) {
    var updatedLists2 = await Watchlist.updateMany(
      {
        user: user,
        "movies.id": movieID,
      },
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
            "movie.id": movieID,
          },
          {
            season: { $exists: true },
            "season.episodes": { $exists: true },
          },
          { episode: { $exists: true } },
        ],
        timestamps: false,
      }
    ).catch((err) => console.error(err));

    if (!updatedLists2) {
      console.error(`Lists not found - user: ${JSON.stringify(user)}`);
      return res.status(400).json({ success: false });
    }
  }
  return { updated: updatedLists?.nModified };
}
