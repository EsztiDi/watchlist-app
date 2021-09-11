export default async function getLocalDate(movie, getDetails = false) {
  var release_date;
  var locale;

  await fetch(`${process.env.BASE_URL}/api/account/locale`)
    .then((res) => res.json())
    .then((res) => {
      locale = getDetails && movie.locale ? movie.locale : res.data || "US";
    })
    .catch((err) => {
      console.error(err);
      locale = getDetails && movie.locale ? movie.locale : "US";
    });

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

        release_date = results?.filter(
          (date) => date.type === 3 || date.type === 2 || date.type === 4
        )[0]?.release_date;

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
