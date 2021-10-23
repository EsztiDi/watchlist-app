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
    var movies = `\n${list.title}\n\n`;

    for (const movie of list.movies) {
      movies += `${movie.title}\n${
        movie.media_type === "tv"
          ? `S${movie.details?.next_episode_to_air?.season_number} E${movie.details?.next_episode_to_air?.episode_number}\n`
          : ""
      }${movie.release_date}\n\n`;
    }

    middle += movies;
  }

  const bottom = `\nEnjoy! 🙂\n\n\nLists: https://mywatchlists.watch/lists\n
Account: https://mywatchlists.watch/account\n
Privacy Notice: https://mywatchlists.watch/privacy\n\n\n\n
You are receiving this email because you have opted in for the weekly releases summary for one or more of your watchlists on mywatchlists.watch\n\n
If you would prefer not to receive emails anymore, you can unsubscribe from all in your account - https://mywatchlists.watch/account - or unselect the "Emails" option - https://mywatchlists.watch/emails-toggle.jpg - for individual watchlists to receive fewer emails.\n\n\n
The Watchlist App  |  London, UK  |  contact@mywatchlists.watch\n\n`;

  return top + middle + bottom;
}
