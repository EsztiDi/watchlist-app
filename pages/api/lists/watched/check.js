import { getSession } from "next-auth/client";
import dbConnect from "../../../../utils/dbConnect";
import checkEpisodes from "../../../../utils/checkEpisodes";
import checkSeasons from "../../../../utils/checkSeasons";

export default async function handler(req, res) {
  var { method } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        var { movieID, season_number } = req.body;

        await checkEpisodes(session?.user, movieID, season_number);
        await checkSeasons(session?.user, movieID);

        res.status(200).json({ success: true });
      } catch (err) {
        console.error(
          `Couldn't update lists - movie: ${movieID} - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/watched/check - user: ${JSON.stringify(
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
