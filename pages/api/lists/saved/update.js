import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import Savedlist from "../../../../models/Savedlist";

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "PUT":
      try {
        var { id, list } = req.body;

        const updatedList = await Savedlist.findOneAndUpdate(
          {
            user: session?.user,
            listid: id,
          },
          list,
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
