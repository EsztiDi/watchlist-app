import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Savedlist from "../../../../models/Savedlist";
import Releasesemail from "../../../../models/Releasesemail";

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
        const list = await Savedlist.findOne({
          user: session?.user,
          listid: id,
        });
        if (!list) {
          console.error(
            `Savedlist ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Savedlist not found -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        console.log(req.body);
        var list, list2;
        if (req.body.hasOwnProperty("position")) {
          const lists = await Savedlist.find(
            { user: session?.user },
            "listid position"
          ).sort({
            position: -1,
          });

          var { position } = req.body;
          const index = lists
            .map((list) => JSON.stringify(list.listid))
            .indexOf(JSON.stringify(id));
          console.log(id, index);
          const data1 = position < 0 ? { position: -position } : req.body; // "-" only indicates direction, the sign needs to be changed
          const data2 = { position: lists[index].position }; // Selected list's position for the swap
          // Selected list
          list = await Savedlist.findOneAndUpdate(
            {
              user: session?.user,
              listid: id,
            },
            data1,
            {
              new: true,
              runValidators: true,
              timestamps: false,
            }
          ).catch((err) => console.error(err));
          // Adjacent list, id depends on the direction
          list2 = await Savedlist.findOneAndUpdate(
            {
              user: session?.user,
              listid:
                position < 0
                  ? lists[index - 1].listid
                  : lists[index + 1].listid,
            },
            data2,
            {
              new: true,
              runValidators: true,
              timestamps: false,
            }
          ).catch((err) => console.error(err));

          if (!list2) {
            console.error(
              `Adjacent savedlist not found for ${id} - user: ${JSON.stringify(
                session?.user
              )}`
            );
            return res.status(400).json({ success: false });
          }
        } else {
          list = await Savedlist.findOneAndUpdate(
            {
              user: session?.user,
              listid: id,
            },
            req.body,
            {
              new: true,
              runValidators: true,
            }
          ).catch((err) => console.error(err));
        }

        if (!list) {
          console.error(
            `Savedlist not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't update savedlist ${id} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedList = await Savedlist.findOneAndDelete({
          user: session?.user,
          listid: id,
        }).catch((err) => console.error(err));

        if (deletedList.emails) {
          // Deleting email subscription
          const deletedEmail = await Releasesemail.findOneAndDelete({
            email: deletedList?.user?.email,
            listid: id,
          }).catch((err) => console.error(err));

          if (!deletedEmail) {
            console.error(`Email - ${deletedList?.user?.email} - not found`);
            return res.status(400).json({ success: false });
          }
        }

        if (!deletedList) {
          console.error(
            `Savedlist ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
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
        `Wrong fetch method used for api/lists/saved/[id] - user: ${JSON.stringify(
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
