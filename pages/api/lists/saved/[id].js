import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Savedlist from "../../../../models/Savedlist";

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
        const updatedList = await Savedlist.findOneAndUpdate(
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

        if (!updatedList) {
          console.error(
            `List not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: updatedList });
      } catch (err) {
        console.error(
          `Couldn't update list ${id} - user: ${JSON.stringify(
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
