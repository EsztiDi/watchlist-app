import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  cell: {
    verticalAlign: "top",
    padding: theme.spacing(1),
  },
  posterCell: {
    "& span:nth-of-type(even)": {
      marginLeft: "5px",
    },
    padding: theme.spacing(1),
    verticalAlign: "text-top",
  },
  poster: {
    borderRadius: "5px",
  },
  tooltip: {
    fontSize: "0.9rem",
    textAlign: "center",
    lineHeight: 1.2,
    // whiteSpace: "nowrap",
    margin: theme.spacing(0.8),
  },
}));

export default function Day({ date, movies }) {
  const classes = useStyles();

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
      ? "142px"
      : "110px";

  const divWidth =
    movies &&
    movies.length > 1 &&
    (sameSeries.length !== movies.length || Object.entries(same).length > 1)
      ? "126px"
      : "94px";

  return movies ? (
    <TableCell width={cellWidth} className={classes.posterCell}>
      {date}
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
                title={
                  <p className={classes.tooltip}>
                    {`${series[0]} S${series[1][0].season_number} E${
                      series[1][0].episode_number
                    }-${series[1][series[1].length - 1].episode_number}`}
                  </p>
                }
              >
                <span>
                  <Image
                    width={60}
                    height={90}
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
                </span>
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
                <span>
                  <Image
                    width={60}
                    height={90}
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
                </span>
              </Tooltip>
            );
          })}
      </div>
    </TableCell>
  ) : (
    <TableCell className={classes.cell}>{date}</TableCell>
  );
}
