import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Savedlist from "../../../../models/Savedlist";
import Releasesemail from "../../../../models/Releasesemail";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const lists = await Savedlist.find({ user: session?.user }).sort({
          createdAt: 1,
        });
        res.status(200).json({ success: true, data: lists });
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
        const deletedList = await Savedlist.findOneAndDelete({
          user: session?.user,
          listid: req.body.id,
        }).catch((err) => console.error(err));

        if (deletedList.emails) {
          const deletedEmail = await Releasesemail.findOneAndDelete({
            email: deletedList?.user?.email,
            listid: req.body.id,
          }).catch((err) => console.error(err));

          if (!deletedEmail) {
            console.error(`Email - ${deletedList?.user?.email} - not found`);
            return res.status(400).json({ success: false });
          }
        }

        if (!deletedList) {
          console.error(
            `Savedlist ${req.body.id} not found - user: ${JSON.stringify(
              session?.user
            )}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: deletedList });
      } catch (err) {
        console.error(
          `Couldn't delete list ${req.body.id} - user: ${JSON.stringify(
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
