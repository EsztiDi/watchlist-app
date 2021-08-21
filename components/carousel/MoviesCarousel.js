import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Carousel from "react-material-ui-carousel";

import MovieDetails from "./MovieDetails";

const useStyles = makeStyles((theme) => ({
  moviesCard: {
    minWidth: "500px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& > :first-child": {
      marginBottom: theme.spacing(1),
    },
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(2.5),
    },
    "& .CarouselItem > div > div:first-child": {
      marginRight: `${theme.spacing(2)}px !important`,
    },
  },
  carousel: {
    overflow: "visible",
  },
  movie: {
    position: "relative",
    display: "inline-block",
    width: "200px",
    height: "300px",
  },
  title: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: theme.spacing(1),
    textShadow: `1px 1px 0px white`,
  },
  poster: {
    borderRadius: "10px",
  },
}));

export default function MoviesCarousel({
  title,
  movies,
  media_type,
  loading,
  setMessage,
}) {
  const classes = useStyles();
  const [data, setData] = React.useState("");

  const handleShowDetails = (ev) => {
    const index = ev?.target?.dataset?.index;
    setData(index);
  };

  var sliced = [];
  if (movies.length > 0) {
    for (var i = 0; i < movies.length; i += 2) {
      sliced.push(movies.slice(i, i + 2));
    }
  }

  return (
    <Paper elevation={1} className={classes.moviesCard}>
      <Typography variant="h4">{title}</Typography>
      <Divider />
      {loading || movies.length === 0 ? (
        <CircularProgress size="3rem" thickness={3} />
      ) : (
        <Carousel
          autoPlay={false}
          interval={5000}
          timeout={300}
          className={classes.carousel}
          indicatorContainerProps={{
            style: {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            },
          }}
        >
          {sliced.map((page) => {
            return page.map((movie, index) => {
              return (
                <div key={index} className={classes.movie}>
                  {!movie?.poster_path && (
                    <div
                      style={
                        index.toString() !== data ? { zIndex: "1" } : undefined
                      }
                      className={classes.title}
                    >
                      <Typography variant="h6">
                        {movie.title
                          ? movie.title
                          : movie.name
                          ? movie.name
                          : "Untitled"}
                      </Typography>
                      <Typography variant="subtitle1">
                        {movie?.release_date
                          ? new Date(movie?.release_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : movie?.first_air_date
                          ? new Date(movie?.first_air_date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "No release date"}
                      </Typography>
                    </div>
                  )}
                  <Image
                    onMouseEnter={handleShowDetails}
                    data-index={index}
                    width={200}
                    height={300}
                    objectFit="contain"
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
                  />
                </div>
              );
            });
          })}
        </Carousel>
      )}
    </Paper>
  );
}
