import Week from "./Week";

const isSameDay = (date, moviesList) => {
  let dayMovies = [];
  moviesList.length > 0 &&
    moviesList.forEach((movie) => {
      if (movie.air_date) {
        let releaseDate = new Date(movie.air_date);
        releaseDate.getDate() === date && dayMovies.push(movie);
      } else {
        let releaseDate = new Date(movie.release_date);
        releaseDate.getDate() === date && dayMovies.push(movie);
      }
    });
  return dayMovies;
};

const getDays = (year, month, moviesList) => {
  let monthMovies = [];
  moviesList.length > 0 &&
    moviesList.forEach((movie) => {
      if (movie.media_type === "tv" && movie.seasons.length > 0) {
        movie.seasons.forEach((season) => {
          season.episodes.length > 0 &&
            season.episodes.forEach((episode) => {
              let releaseDate = new Date(episode.air_date);
              if (
                releaseDate.getFullYear() === year &&
                releaseDate.getMonth() === month
              ) {
                monthMovies.push({
                  ...episode,
                  mainName: movie.title,
                  poster_path: movie.poster_path,
                });
              }
            });
        });
      } else {
        let releaseDate = new Date(movie.release_date);
        if (
          releaseDate.getFullYear() === year &&
          releaseDate.getMonth() === month
        ) {
          monthMovies.push(movie);
        }
      }
    });

  const firstDayOfMonth =
    new Date(year, month).getDay() === 0
      ? 6
      : new Date(year, month).getDay() - 1;
  const noOfDaysInMonth = 32 - new Date(year, month, 32).getDate();
  const days = [];
  let date = 1;
  for (let i = 0; i < 6; i++) {
    const dates = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        dates.push({ date: "" });
      } else if (date > noOfDaysInMonth) {
        break;
      } else {
        const dayMovies = isSameDay(date, monthMovies);
        if (dayMovies.length > 0) {
          dates.push({
            date: date,
            movies: dayMovies,
          });
        } else {
          dates.push({ date: date });
        }
        date++;
      }
    }
    days.push(dates);
  }
  return days;
};

export default function Month({ year, month, movies }) {
  const dates = getDays(year, month, movies);

  return <Week rows={dates} />;
}
