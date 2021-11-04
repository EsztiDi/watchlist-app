import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Savedlist from "../../../../models/Savedlist";
import Releasesemail from "../../../../models/Releasesemail";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  var db = await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (session && db) {
          const lists = await Savedlist.find({
            "user.email": session?.user?.email,
          })
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
          `Savedlists not found -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const lists = await Savedlist.find({
          "user.email": session?.user?.email,
        }).sort({
          position: -1,
        });

        if (lists.length > 0) {
          req.body.position = lists[0].position + 1;
        } else if (req.body.position === undefined) {
          req.body.position = 0;
        }

        req.body.user = session?.user;

        const list = await Savedlist.create(req.body).catch((err) =>
          console.error(err)
        );
        res.status(201).json({ success: true, data: list });
      } catch (err) {
        console.error(
          `Couldn't create savedlist -  user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        // Deleting all saved lists
        const deletedLists = await Savedlist.deleteMany({
          "user.email": session?.user?.email,
        }).catch((err) => console.error(err));
        if (!deletedLists) {
          console.error(
            `Couldn't perform deleteMany() in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }

        // Deleting all subscriptions
        const deletedEmails = await Releasesemail.deleteMany({
          email: session?.user?.email,
          savedList: true,
        }).catch((err) => console.error(err));

        if (!deletedEmails) {
          console.error(
            `Couldn't perform deleteMany() for emails in MongoDB - user: ${JSON.stringify(
              session?.user
            )}`
          );
        }

        res.status(200).json({ success: true, data: deletedLists });
      } catch (err) {
        console.error(
          `Couldn't delete lists - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/lists/saved - user: ${JSON.stringify(
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
