import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Carousel from "react-material-ui-carousel";

import CarouselMovieCard from "./CarouselMovieCard";

const useStyles = makeStyles((theme) => ({
  moviesCard: {
    width: "450px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px ${theme.spacing(1)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& .CarouselItem > div > div:first-child": {
      marginRight: `${theme.spacing(2)}px !important`,
    },
  },
  moviesCardMobile: {
    width: "400px",
    minHeight: "410px",
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
  },
  moviesCardMobile2: {
    width: "100%",
    minHeight: "410px",
    margin: `${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
  },
  carouselTitle: {
    marginBottom: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(2.5),
  },
  skeletons: {
    "& > span": {
      display: "inline-block",
      borderRadius: "10px",
    },
    "& > span:nth-child(2)": {
      marginLeft: `${theme.spacing(2)}px`,
    },
  },
  carousel: {
    overflow: "visible",
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
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:520px)");
  const matches3 = useMediaQuery("(min-width:1024px)");

  var sliced = [];
  if (movies.length > 0) {
    for (var i = 0; i < movies.length; i += matches ? 1 : 2) {
      sliced.push(movies.slice(i, matches ? i + 1 : i + 2));
    }
  }

  return (
    <Paper
      elevation={1}
      className={
        matches2
          ? classes.moviesCardMobile2
          : matches
          ? classes.moviesCardMobile
          : classes.moviesCard
      }
    >
      <Typography variant="h4" className={classes.carouselTitle}>
        {title}
      </Typography>
      <Divider className={classes.divider} />
      {loading || movies.length === 0 ? (
        <span className={classes.skeletons}>
          <Skeleton variant="rect" width={200} height={300} />
          {matches3 && <Skeleton variant="rect" width={200} height={300} />}
        </span>
      ) : (
        <Carousel
          autoPlay={false}
          interval={5000}
          timeout={300}
          className={classes.carousel}
          navButtonsProps={{
            style: {
              margin: 0,
            },
          }}
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
                <CarouselMovieCard
                  key={index}
                  index={index}
                  movie={movie}
                  media_type={media_type}
                  setMessage={setMessage}
                />
              );
            });
          })}
        </Carousel>
      )}
    </Paper>
  );
}
