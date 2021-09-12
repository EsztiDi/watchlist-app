import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MovieDetails from "./MovieDetails";

const useStyles = makeStyles((theme) => ({
  movie: {
    position: "relative",
    display: "inline-block",
    width: "200px",
    height: "300px",
  },
  title: {
    width: "100%",
    position: "absolute",
    top: 0,
    borderRadius: "10px",
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    textShadow: `1px 1px 0px white`,
    "& > :nth-child(2)": {
      marginTop: theme.spacing(0.5),
    },
  },
  poster: {
    borderRadius: "10px",
  },
}));

export default function CarouselMovieCard({
  index,
  movie,
  media_type,
  locale,
  setMessage,
}) {
  const classes = useStyles();
  const [data, setData] = React.useState(undefined);
  const touch = useMediaQuery("(hover: none)");

  const handleShowDetails = (ev) => {
    const index = ev?.target?.dataset?.index;
    setTimeout(
      () => {
        setData(index);
      },
      touch ? 150 : 0
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setData(undefined)}>
      <div key={index} className={classes.movie}>
        {!movie?.poster_path && (
          <div
            style={index.toString() !== data ? { zIndex: "1" } : undefined}
            className={classes.title}
          >
            <Typography variant="h6">
              {movie.title ? movie.title : movie.name ? movie.name : "Untitled"}
            </Typography>
            <Typography variant="subtitle1">
              {movie?.release_date
                ? new Date(movie?.release_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : movie?.first_air_date
                ? new Date(movie?.first_air_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "No release date"}
              {media_type === "movie" && (
                <Typography
                  variant="caption"
                  style={{ verticalAlign: "text-bottom" }}
                >
                  {" "}
                  ({locale})
                </Typography>
              )}
            </Typography>
          </div>
        )}
        <Image
          onMouseEnter={!touch ? handleShowDetails : undefined}
          onTouchStart={touch ? handleShowDetails : undefined}
          data-index={index}
          width={200}
          height={300}
          objectFit={movie?.poster_path ? "cover" : "contain"}
          src={
            movie?.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie?.poster_path}`
              : "/movieIcon.png"
          }
          onError={(ev) => {
            ev.target.onerror = null;
            ev.target.src = "/movieIcon.png";
          }}
          alt=""
          className={classes.poster}
        />

        <MovieDetails
          movie={movie}
          media_type={media_type}
          setMessage={setMessage}
          show={index.toString() === data}
          handleShowDetails={handleShowDetails}
          locale={locale}
        />
      </div>
    </ClickAwayListener>
  );
}
