import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import getDetails from "../../../utils/getDetails";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        console.log("Running cron database update");

        const updates = await Watchlist.find()
          .then(async (lists) => {
            return await Promise.all(
              lists.map(async (list) => {
                if (list.movies.length > 0) {
                  var originalList = JSON.stringify(list);

                  list.movies = await Promise.all(
                    list.movies.map(async (movie) => {
                      return await getDetails(movie);
                    })
                  );

                  if (originalList !== JSON.stringify(list)) {
                    return await list
                      .save()
                      .then(() => {
                        console.log(`${list._id} - saved`);
                        return 1;
                      })
                      .catch((err) => {
                        console.error(
                          `Error saving watchlist - ${
                            list._id
                          } - ${JSON.stringify(err)}`
                        );
                        return 0;
                      });
                  } else {
                    return 0;
                  }
                } else {
                  return 0;
                }
              })
            );
          })
          .catch((err) => {
            console.error(
              `Couldn't update watchlist collection - ${JSON.stringify(err)}`
            );
          });

        var count = updates.reduce((a, b) => a + b, 0);
        console.log(
          `Update done - ${count} ${count === 1 ? "list" : "lists"} updated ^^`
        );

        res.status(200).json({
          success: true,
          data: `${count} ${count === 1 ? "list" : "lists"} updated`,
        });
      } catch (err) {
        console.error(
          `Couldn't perform daily cron update - ${JSON.stringify(err)}`
        );
        res
          .status(400)
          .json({ success: false, data: `${JSON.stringify(err)}` });
      }
      break;

    default:
      console.error(`Wrong fetch method used for api/cron/daily - ${method}`);
      break;
  }
}
