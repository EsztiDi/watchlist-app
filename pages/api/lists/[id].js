import { getSession } from "next-auth/client";

import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";
import Releasesemail from "../../../models/Releasesemail";
import Savedlist from "../../../models/Savedlist";

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
          const list = await Watchlist.findById(id).catch((err) =>
            console.error(err)
          );
          if (!list) {
            console.error(
              `List ${id} not found - user: ${JSON.stringify(session?.user)}`
            );
            return res.status(400).json({ success: false });
          }
          res.status(200).json({ success: true, data: list });
        } else {
          res.status(200).json({ success: true, data: [] });
        }
      } catch (err) {
        console.error(
          `List ${id} not found - user: ${JSON.stringify(
            session?.user
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
            { "user.email": session?.user?.email },
            "_id position"
          )
            .sort({
              position: -1,
            })
            .catch((err) => console.error(err));

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
            timestamps: false,
          }).catch((err) => console.error(err));
          // Adjacent list, id depends on the direction
          list2 = await Watchlist.findByIdAndUpdate(
            position < 0 ? lists[index - 1].id : lists[index + 1].id,
            data2,
            {
              new: true,
              runValidators: true,
              timestamps: false,
            }
          ).catch((err) => console.error(err));

          if (!list2) {
            console.error(
              `Adjacent list not found for ${id} - user: ${JSON.stringify(
                session?.user
              )}`
            );
            return res.status(400).json({ success: false });
          }
        } else {
          list = await Watchlist.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
          }).catch((err) => console.error(err));

          if (req.body.hasOwnProperty("title")) {
            const savedLists = await Savedlist.updateMany(
              { listid: id },
              req.body,
              {
                timestamps: false,
              }
            ).catch((err) => console.error(err));
            if (!savedLists) {
              console.error(
                `Couldn't perform updateMany() for Savedlist title in MongoDB - list: ${id} - user: ${JSON.stringify(
                  session?.user
                )}`
              );
            }
          }
        }
        if (!list) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't update lists - ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const deletedList = await Watchlist.findByIdAndDelete(id).catch((err) =>
          console.error(err)
        );
        if (!deletedList) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }

        if (deletedList.emails) {
          // Check if subscription has listid attached and delete that or one without
          const email = await Releasesemail.find({
            email: deletedList?.user?.email,
            listid: id,
          }).catch((err) => console.error(err));

          var deletedEmail;
          if (email.length !== 0) {
            deletedEmail = await Releasesemail.findOneAndDelete({
              email: deletedList?.user?.email,
              listid: id,
            }).catch((err) => console.error(err));
          } else {
            deletedEmail = await Releasesemail.findOneAndDelete({
              email: deletedList?.user?.email,
              listid: "",
            }).catch((err) => console.error(err));
          }

          if (!deletedEmail) {
            console.error(`Email - ${deletedList?.user?.email} - not found`);
            return res.status(400).json({ success: false });
          }
        }

        // Deleting list for others if saved
        await Savedlist.deleteMany({
          listid: id,
          "creator.email": session?.user?.email,
        }).catch((err) => {
          console.error(
            `Couldn't delete saved list for others - user: ${JSON.stringify(
              user
            )} - ${JSON.stringify(err)}`
          );
          return res.status(400).json({ success: false });
        });

        res.status(200).json({ success: true, data: deletedList });
      } catch (err) {
        console.error(
          `Couldn't delete list ${id} - user: ${JSON.stringify(
            session?.user
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
