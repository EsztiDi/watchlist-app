import { getSession } from "next-auth/client";

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const list = await Watchlist.findById(id);
        if (!list) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `List ${id} not found - user: ${JSON.stringify(
            session.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        var list, list2;
        if (req.body.hasOwnProperty("position")) {
          const lists = await Watchlist.find(
            { user: session.user },
            "_id position"
          ).sort({
            position: -1,
          });

          var { position } = req.body;
          const index = lists
            .map((list) => JSON.stringify(list._id))
            .indexOf(JSON.stringify(id));
          const data1 = position < 0 ? { position: -position } : req.body; // "-" only indicates direction, the sign needs to be changed
          const data2 = { position: lists[index].position }; // Selected list's position for the swap
          // Selected list
          list = await Watchlist.findByIdAndUpdate(id, data1, {
            new: true,
            runValidators: true,
          });
          // Adjacent list, id depends on the direction
          list2 = await Watchlist.findByIdAndUpdate(
            position < 0 ? lists[index - 1].id : lists[index + 1].id,
            data2,
            {
              new: true,
              runValidators: true,
            }
          );

          if (!list2) {
            console.error(
              `Adjacent list not found for ${id} - user: ${JSON.stringify(
                session.user
              )}`
            );
            return res.status(400).json({ success: false });
          }
        } else {
          list = await Watchlist.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          });
        }
        if (!list) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't update lists - ${id} - user: ${JSON.stringify(
            session.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedList = await Watchlist.findByIdAndDelete(id);
        if (!deletedList) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedList });
      } catch (err) {
        console.error(
          `Couldn't delete list ${id} - user: ${JSON.stringify(
            session.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/[id] - user: ${JSON.stringify(
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
