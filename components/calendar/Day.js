import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  cell: {
    verticalAlign: "top",
    padding: theme.spacing(1),
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
  },
  posterCell: {
    "& a:nth-of-type(even)": {
      marginLeft: "5px",
    },
    padding: theme.spacing(1),
    verticalAlign: "text-top",
    borderBottom: "2px solid rgba(224, 224, 224, 1)",
  },
  poster: {
    borderRadius: "5px",
  },
  tooltip: {
    fontSize: "0.9rem",
    textAlign: "center",
    lineHeight: 1.2,
    margin: theme.spacing(0.8),
  },
  tooltipPadding: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    margin: `${theme.spacing(1)}px 0`,
  },
}));

const today = new Date();

export default function Day({ date, month, year, movies }) {
  const classes = useStyles();
  const touch = useMediaQuery("(hover: none)");

  const thisDay =
    date === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  // Series episodes released on the same day to appear under one image on the calendar
  const names =
    movies &&
    movies.reduce(
      (ep, { mainName }) => ep.set(mainName, ep.has(mainName)),
      new Map()
    );
  const sameSeries =
    movies && movies.filter(({ mainName }) => mainName && names.get(mainName));

  var same = {};
  if (sameSeries && sameSeries.length > 0) {
    same = sameSeries.reduce((r, a) => {
      r[a.mainName] = r[a.mainName] || [];
      r[a.mainName].push(a);
      return r;
    }, same);
  }
  const cellWidth =
    movies &&
    movies.length > 1 &&
    (sameSeries.length !== movies.length || Object.entries(same).length > 1)
      ? "141px"
      : "76px";

  const divWidth =
    movies &&
    movies.length > 1 &&
    (sameSeries.length !== movies.length || Object.entries(same).length > 1)
      ? "125px"
      : "60px";

  return movies ? (
    <TableCell width={cellWidth} className={classes.posterCell}>
      <span
        style={{
          fontWeight: thisDay ? "bold" : "",
          background: thisDay ? "#F8D070" : "",
          borderRadius: thisDay ? "50%" : "",
          padding: "3.5px",
        }}
      >
        {date}
      </span>
      <div
        style={{
          width: divWidth,
        }}
      >
        {sameSeries.length > 0 &&
          Object.entries(same).map((series, index) => {
            return (
              <Tooltip
                key={index}
                arrow
                enterTouchDelay={0}
                leaveTouchDelay={5000}
                classes={{
                  tooltip: classes.tooltipPadding,
                }}
                title={
                  <p className={classes.tooltip}>
                    {`${series[0]} S${series[1][0].season_number} E${
                      series[1][0].episode_number
                    }-${series[1][series[1].length - 1].episode_number}`}
                  </p>
                }
              >
                <a
                  href={
                    !touch
                      ? `https://www.imdb.com/title/${series[1][0].imdb_id}`
                      : undefined
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    width={60}
                    height={90}
                    objectFit={series[1][0].poster_path ? "cover" : "contain"}
                    src={
                      series[1][0].poster_path
                        ? `https://image.tmdb.org/t/p/w92${series[1][0].poster_path}`
                        : "/movieIcon.png"
                    }
                    onError={(ev) => {
                      ev.target.onerror = null;
                      ev.target.src = "/movieIcon.png";
                    }}
                    alt=""
                    className={classes.poster}
                  />
                </a>
              </Tooltip>
            );
          })}
        {movies
          .filter((episode) => !sameSeries.includes(episode))
          .map((movie, index) => {
            return (
              <Tooltip
                key={`${movie.id}-${index}`}
                arrow
                enterTouchDelay={0}
                leaveTouchDelay={5000}
                classes={{
                  tooltip: classes.tooltipPadding,
                }}
                title={
                  <p className={classes.tooltip}>
                    {movie.title
                      ? movie.title
                      : movie.mainName
                      ? `${movie.mainName} S${movie.season_number} E${movie.episode_number}`
                      : "-"}
                  </p>
                }
              >
                <a
                  href={
                    !touch
                      ? movie.imdb_id
                        ? `https://www.imdb.com/title/${movie.imdb_id}`
                        : `https://www.imdb.com/title/${movie.details?.external_ids?.imdb_id}`
                      : undefined
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    width={60}
                    height={90}
                    objectFit={movie.poster_path ? "cover" : "contain"}
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : "/movieIcon.png"
                    }
                    onError={(ev) => {
                      ev.target.onerror = null;
                      ev.target.src = "/movieIcon.png";
                    }}
                    alt=""
                    className={classes.poster}
                  />
                </a>
              </Tooltip>
            );
          })}
      </div>
    </TableCell>
  ) : (
    <TableCell className={classes.cell}>
      <span
        style={{
          fontWeight: thisDay ? "bold" : "",
          background: thisDay ? "#F8D070" : "",
          borderRadius: thisDay ? "50%" : "",
          padding: "3.5px",
        }}
      >
        {date}
      </span>
    </TableCell>
  );
}
