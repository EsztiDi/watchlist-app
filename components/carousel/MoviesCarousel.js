import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Carousel from "react-material-ui-carousel";

import MovieDetails from "./MovieDetails";
import React from "react";

const useStyles = makeStyles((theme) => ({
  moviesCard: {
    minWidth: "500px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& > :first-child": {
      marginBottom: theme.spacing(1),
      fontFamily: "'Bangers', cursive",
    },
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(2.5),
    },
    "& .CarouselItem > div > div:first-child": {
      marginRight: `${theme.spacing(2)}px !important`,
    },
  },
  poster: {
    borderRadius: "10px",
    position: "relative",
  },
}));

export default function MoviesCarousel({ title, movies, media_type, loading }) {
  const classes = useStyles();
  var sliced = [];

  for (var i = 0; i < movies.length; i += 2) {
    sliced.push(movies.slice(i, i + 2));
  }

  return (
    <Paper elevation={1} className={classes.moviesCard}>
      <Typography variant="h4">{title}</Typography>
      <Divider />
      {loading && movies.length === 0 ? (
        <CircularProgress size="3rem" thickness={3} />
      ) : movies.length ? (
        <Carousel
          autoPlay={false}
          interval={5000}
          timeout={300}
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
                <React.Fragment key={index}>
                  <Image
                    width={200}
                    height={300}
                    objectFit="contain"
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/movieIcon.png"
                    }
                    onError={(ev) => {
                      ev.target.onerror = null;
                      ev.target.src = "/movieIcon.png";
                    }}
                    alt="Poster"
                    className={classes.poster}
                  />
                  <MovieDetails
                    movie={movie}
                    media_type={media_type}
                    left={index % 2 === 0}
                  />
                </React.Fragment>
              );
            });
          })}
        </Carousel>
      ) : (
        <Typography>No new movies</Typography>
      )}
    </Paper>
  );
}
