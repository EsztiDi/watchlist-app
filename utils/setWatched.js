import Watchlist from "../models/Watchlist";

export default async function setWatched(movieID, watched, tv, listID) {
  // Updating movie to "watched"
  var updatedList = await Watchlist.findOneAndUpdate(
    { _id: listID, "movies.id": movieID },
    { "movies.$.watched": watched },
    {
      new: true,
      runValidators: true,
      timestamps: false,
    }
  ).catch((err) => console.error(err));

  if (!updatedList) {
    console.error(`setWatched - List not found - ${listID}`);
  }

  // Changing all seasons and episodes to "watched" if tv show
  if (tv) {
    var updatedList2 = await Watchlist.findOneAndUpdate(
      { _id: listID, "movies.id": movieID },
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
        new: true,
        runValidators: true,
        timestamps: false,
      }
    ).catch((err) => console.error(err));

    if (!updatedList2) {
      console.error(`setWatched - List not found - ${listID}`);
    }
  }
  return updatedList;
}
