export default async function getLocalDate(movie, loc = null) {
  var release_date;
  var locale;

  if (!loc) {
    await fetch(`${process.env.BASE_URL}/api/account/locale`)
      .then((res) => res.json())
      .then((res) => {
        locale = movie.locale ? movie.locale : res.data || "US";
      })
      .catch((err) => {
        console.error(err);
        locale = movie.locale ? movie.locale : "US";
      });
  } else {
    locale = loc;
  }

  if (movie.media_type === "movie") {
    var baseURL = "https://api.themoviedb.org/3";
    var api_key = process.env.TMDB_API_KEY;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
    };
    var url = `/movie/${movie.id}/release_dates`;
    var fullUrl = `${baseURL}${url}?api_key=${api_key}`;
    await fetch(fullUrl, options)
      .then((res) => res.json())
      .then((data) => {
        var results = data?.results?.filter(
          (date) => date.iso_3166_1 === locale
        )[0]?.release_dates;

        var dates = [];
        results?.forEach((date) => {
          if (date.type === 3) dates.push(date);
        });
        results?.forEach((date) => {
          if (date.type === 2) dates.push(date);
        });
        results?.forEach((date) => {
          if (date.type === 4) dates.push(date);
        });
        results?.forEach((date) => {
          if (date.type === 6) dates.push(date);
        });
        results?.forEach((date) => {
          if (date.type === 5) dates.push(date);
        });

        release_date = dates[0]?.release_date;

        if (release_date) {
          release_date = new Date(release_date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
        }
      })
      .catch((err) => {
        console.error(
          `Error fetching local release dates - movie: ${
            movie.id
          } - ${JSON.stringify(err)}`
        );
      });
  }
  return { release_date, locale };
}
