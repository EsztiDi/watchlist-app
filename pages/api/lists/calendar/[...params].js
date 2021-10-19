import { getSession } from "next-auth/client";

import getLocalDate from "../../../../utils/getLocalDate";
import dbConnect from "../../../../utils/dbConnect";
import Watchlist from "../../../../models/Watchlist";

const isSameDay = async (date, moviesList) => {
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

const getDays = async (year, month, moviesList, loc) => {
  let monthMovies = [];

  moviesList.length > 0 &&
    (await Promise.all(
      moviesList.map(async (movie) => {
        if (movie.media_type === "tv" && movie.seasons?.length > 0) {
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
                    mainTitle: movie.title,
                    poster_path: movie.poster_path,
                    imdb_id: movie.details?.external_ids?.imdb_id,
                  });
                }
              });
          });
        } else {
          let releaseDate, release_date;
          if (movie.locale !== loc) {
            ({ release_date } = await getLocalDate(movie, loc));

            releaseDate = new Date(
              release_date ? release_date : movie.release_date
            );
          } else {
            releaseDate = new Date(movie.release_date);
          }

          if (
            releaseDate.getFullYear() === year &&
            releaseDate.getMonth() === month
          ) {
            if (movie.locale !== loc) {
              monthMovies.push({ ...movie, release_date });
            } else {
              monthMovies.push(movie);
            }
          }
        }
      })
    ));

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
        const dayMovies = await isSameDay(date, monthMovies);
        if (dayMovies.length > 0) {
          dates.push({
            date: date,
            movies: dayMovies.sort((a, b) => a.position - b.position),
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

export default async function handler(req, res) {
  const {
    query: { params },
    method,
  } = req;
  const session = await getSession({ req });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        var [id, year, month, loc] = params;
        year = parseInt(year);
        month = parseInt(month);
        var movies;

        const list = await Watchlist.findById(id);

        if (!list) {
          console.error(
            `List ${id} not found - user: ${JSON.stringify(session?.user)}`
          );
          return res.status(400).json({ success: false });
        } else {
          ({ movies } = list);
        }

        var weekMovies = await getDays(year, month, movies, loc);

        res.status(200).json({ success: true, data: weekMovies });
      } catch (err) {
        console.error(
          `List ${id} not found - user: ${JSON.stringify(
            session?.user
          )} - ${JSON.stringify(err)}`
        );
        res.status(400).json({ success: false });
      }
      break;

    default:
      console.error(
        `Wrong fetch method used for api/lists/calendar/[...params] - user: ${JSON.stringify(
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
