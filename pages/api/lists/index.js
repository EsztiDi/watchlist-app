import { getSession } from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  var db = await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (db) {
          const lists = await Watchlist.find(
            { "user.email": session?.user?.email },
            "_id title movies position"
          )
            .sort({
              position: -1,
            })
            .catch((err) => console.error(err));
          res.status(200).json({ success: true, data: lists });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      } catch (err) {
        console.error(
          `Lists not found -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const watchedList = await Watchlist.findOne({
          "user.email": session?.user?.email,
          title: /^Watched$/i,
        }).catch((err) => console.error(err));
        if (watchedList && /^Watched$/i.test(req.body.title)) {
          res.statusMessage = `You already have a Watched list`;
          res.status(400).end();
        } else {
          const lists = await Watchlist.find({
            "user.email": session?.user?.email,
          })
            .sort({
              position: -1,
            })
            .catch((err) => console.error(err));

          if (lists.length > 0) {
            req.body.position = lists[0].position + 1;
          } else if (req.body.position === undefined) {
            req.body.position = 0;
          }

          req.body.user = req.body.user || session?.user;

          // Adding all watched movies to the list if it's titled "Watched"
          if (/^Watched$/i.test(req.body.title)) {
            await Watchlist.find({
              "user.email": session?.user?.email,
              "movies.watched": "true",
            })
              .then(async (lists) => {
                var movies = lists.reduce(
                  (list1, list2) => [...list1, ...list2.movies],
                  []
                );
                var uniques = movies
                  .filter((movie) => movie.watched === "true")
                  ?.filter(
                    (movie, index, array) =>
                      array.findIndex((el) => el.id === movie.id) === index
                  );
                if (uniques.length > 0) {
                  req.body.movies = [...req.body.movies, ...uniques].filter(
                    (movie, index, array) =>
                      array.findIndex((el) => el.id === movie.id) === index
                  );
                }
              })
              .catch((err) => console.error(err));
          }

          const list = await Watchlist.create(req.body).catch((err) =>
            console.error(err)
          );

          res.status(201).json({ success: true, data: list });
        }
      } catch (err) {
        console.error(
          `Couldn't create list -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/lists - user: ${JSON.stringify(
          session?.user
        )} - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
  },
};
