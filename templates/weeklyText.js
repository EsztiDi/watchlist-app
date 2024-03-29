export default function weeklyText(lists) {
  var tomorrow = new Date(new Date().setUTCHours(0, 0, 0, 0) + 60000 * 60 * 24);
  var nextWeek = new Date(
    new Date().setUTCHours(0, 0, 0, 0) + 60000 * 60 * 24 * 7
  );
  const day1 = tomorrow.getDate();
  const day2 = nextWeek.getDate();
  const month1 = tomorrow.toLocaleString("default", { month: "short" });
  const month2 = nextWeek.toLocaleString("default", { month: "short" });
  const title = `Upcoming releases\n${
    month1 === month2
      ? `${day1} - ${day2} ${month1}`
      : `${day1} ${month1} - ${day2} ${month2}`
  }`;

  const top = `${title}\n\n`;

  var middle = ``;
  for (const list of lists) {
    var movies = `\n${list.title}${
      list.creator ? `\nby ${list.creator}` : ""
    }\n\n`;

    for (const movie of list.movies) {
      movies += `${movie.title}\n${
        movie.media_type === "tv"
          ? `S${movie.details?.next_episode_to_air?.season_number} E${movie.details?.next_episode_to_air?.episode_number}\n`
          : ""
      }${new Date(movie.release_date).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })}\n\n`;
    }

    middle += movies;
  }

  const bottom = `\nEnjoy! 🙂\n\n\nLists: https://mywatchlists.xyz/lists\n
Account: https://mywatchlists.xyz/account\n
Privacy Notice: https://mywatchlists.xyz/privacy\n\n\n\n
You are receiving this email because you have opted in for the weekly releases summary for one or more of your watchlists on mywatchlists.xyz\n\n
If you would prefer not to receive emails anymore, you can unsubscribe from all in your account - https://mywatchlists.xyz/account - or unselect the "Emails" option - https://mywatchlists.xyz/emails-toggle.jpg - for individual watchlists to receive fewer emails.\n\n\n
The Watchlist App  |  London, UK  |  contact@mywatchlists.xyz\n\n`;

  return top + middle + bottom;
}
