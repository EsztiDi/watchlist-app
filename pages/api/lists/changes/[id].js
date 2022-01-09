import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getSession({ req });

  var db = await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (db) {
          const list = await Watchlist.findById(id, "changes").catch((err) =>
            console.error(err)
          );
          if (!list) {
            console.error(`List ${id} for changes not found`);
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: list?.changes });
        } else {
          res.status(200).json({ success: true, data: false });
        }
      } catch (err) {
        console.error(`List ${id} not found - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        var changes = await Watchlist.findById(id, "changes").catch((err) =>
          console.error(err)
        );
        req.body.user = session?.user?.name || req.body.user || "Anonymous";
        req.body.date = new Date();

        if (changes?.changes?.length > 49) {
          changes?.changes?.sort((a, b) => b.date - a.date).pop();
        }

        var list = await Watchlist.findByIdAndUpdate(
          id,
          { changes: [...changes?.changes, req.body] },
          {
            new: true,
            runValidators: true,
            timestamps: false,
          }
        ).catch((err) => console.error(err));

        if (!list) {
          console.error(
            `List ${id} for changes not found - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't update list - ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/changes/[id] - list: ${id} - ${method}`
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
