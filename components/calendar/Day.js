import { makeStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles((theme) => ({
  cell: {
    verticalAlign: "top",
    padding: theme.spacing(1),
  },
  posterCell: {
    "& img:nth-of-type(even)": {
      marginLeft: "5px",
    },
    padding: theme.spacing(1),
  },
  poster: {
    width: "60px",
    borderRadius: "5px",
  },
  tooltip: {
    fontSize: "0.9rem",
    margin: theme.spacing(0.8),
  },
}));

export default function Day({ date, movies }) {
  const classes = useStyles();

  const names =
    movies &&
    movies.reduce(
      (ep, { mainName }) => ep.set(mainName, ep.has(mainName)),
      new Map()
    );
  const sameSeries =
    movies && movies.filter(({ mainName }) => mainName && names.get(mainName));

  return movies ? (
    <TableCell
      width={
        movies.length > 1 && sameSeries.length !== movies.length
          ? "142px"
          : "110px"
      }
      className={classes.posterCell}
    >
      {date}
      <div
        style={{
          width:
            movies.length > 1 && sameSeries.length !== movies.length
              ? "126px"
              : "94px",
        }}
      >
        {sameSeries.length > 0 && (
          <Tooltip
            key={sameSeries[0].id}
            arrow
            title={
              <p className={classes.tooltip}>
                {`${sameSeries[0].mainName} S${sameSeries[0].season_number} E${
                  sameSeries[0].episode_number
                }-${sameSeries[sameSeries.length - 1].episode_number}`}
              </p>
            }
          >
            <img
              src={
                sameSeries[0].poster_path
                  ? `https://image.tmdb.org/t/p/w92${sameSeries[0].poster_path}`
                  : "/movieIcon.png"
              }
              onError={(ev) => {
                ev.target.onerror = null;
                ev.target.src = "/movieIcon.png";
              }}
              alt="Poster"
              className={classes.poster}
            ></img>
          </Tooltip>
        )}
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
                      : // : movie.name
                        // ? `${movie.name}${
                        //     movie.details?.next_episode_to_air
                        //       ? " S" +
                        //         movie.details?.next_episode_to_air
                        //           ?.season_number +
                        //         " E" +
                        //         movie.details?.next_episode_to_air?.episode_number
                        //       : movie.details?.last_episode_to_air
                        //       ? " S" +
                        //         movie.details?.last_episode_to_air
                        //           ?.season_number +
                        //         " E" +
                        //         movie.details?.last_episode_to_air?.episode_number
                        //       : ""
                        //   }`
                        "-"}
                  </p>
                }
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "/movieIcon.png"
                  }
                  onError={(ev) => {
                    ev.target.onerror = null;
                    ev.target.src = "/movieIcon.png";
                  }}
                  alt="Poster"
                  className={classes.poster}
                ></img>
              </Tooltip>
            );
          })}
      </div>
    </TableCell>
  ) : (
    <TableCell className={classes.cell}>{date}</TableCell>
  );
}
