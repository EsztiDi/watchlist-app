import dbConnect from "../../../../utils/dbConnect";
import Releasesemail from "../../../../models/Releasesemail";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const emails = await Releasesemail.find();
        res.status(200).json({
          success: true,
          data: emails
            .map((user) => user.email)
            .filter((email, index, arr) => arr.indexOf(email) === index),
        });
      } catch (err) {
        console.error(`Releasesemails not found - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const email = await Releasesemail.create(req.body).catch((err) =>
          console.error(err)
        );
        res.status(201).json({ success: true, data: email });
      } catch (err) {
        console.error(`Couldn't create releasesemail - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        // Check if subscription has listid attached and delete that or one without
        const email = await Releasesemail.find(req.body).catch((err) =>
          console.error(err)
        );

        var deletedEmail;
        if (email.length !== 0) {
          deletedEmail = await Releasesemail.findOneAndDelete(req.body).catch(
            (err) => console.error(err)
          );
        } else {
          deletedEmail = await Releasesemail.findOneAndDelete({
            email: req.body.email,
            listid: "",
          }).catch((err) => console.error(err));
        }

        if (!deletedEmail) {
          console.error(`Email - ${JSON.stringify(req.body)} - not found`);
        }
        res.status(201).json({ success: true, data: deletedEmail });
      } catch (err) {
        console.error(`Couldn't delete releasesemail - ${JSON.stringify(err)}`);
        res.status(400).json({ success: false });
      }
      break;
    default:
      console.error(
        `Wrong fetch method used for api/emails/releases - ${method}`
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
