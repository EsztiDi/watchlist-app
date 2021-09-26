export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Identify the original incoming request's location
      var ip =
        req.headers["x-forwarded-for"]?.split(",").shift() ||
        req.socket?.remoteAddress;

      await fetch(`https://ipinfo.io/${ip}/json?token=ce08a565a65fd0`)
        .then((res) => res.json())
        .then((data) => {
          res.status(200).json({ success: true, data: data?.country || "US" });
        })
        .catch((err) => {
          console.error(`Error fetching locale ${JSON.stringify(err)}`);
          res.status(400).json({ success: false });
        });

      break;

    default:
      console.error(
        `Wrong fetch method used for api/account/locale - ${method}`
      );
      res.status(400).json({ success: false });
      break;
  }
}
