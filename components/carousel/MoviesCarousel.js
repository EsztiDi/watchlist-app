import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Carousel from "react-material-ui-carousel";

import CarouselMovieCard from "./CarouselMovieCard";
import MonthPicker from "../calendar/MonthPicker";

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
    margin: `${theme.spacing(3)}px ${theme.spacing(0.5)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    overflow: "auto",
  },
  carouselTitle: {
    marginBottom: theme.spacing(1),
    "& > span": {
      display: "block",
    },
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

const today = new Date();

export default function MoviesCarousel({
  title,
  media_type,
  locale,
  popular,
  setMessage,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:480px)");
  const matches3 = useMediaQuery("(min-width:1024px)");

  var [year, setYear] = useState(today.getFullYear());
  var [month, setMonth] = useState(today.getMonth());
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    var isMounted = true;

    var month2 = month + 1;
    var selectedMonth = month2 < 10 ? `0${month2}` : month2;

    const controller = new AbortController();
    const signal = controller.signal;

    var baseURL = "https://api.themoviedb.org/3";
    var api_key = process.env.TMDB_API_KEY;
    var adult = `&include_adult=false`;
    var type = `&with_release_type=3|2`;
    var sort = `&sort_by=popularity.desc`;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
      signal,
    };

    const getMovies = async () => {
      setLoading(true);

      var url = "/discover/movie";
      var region = `&region=${locale}`;
      var params = `&release_date.gte=${year}-${selectedMonth}-01&release_date.lte=${year}-${selectedMonth}-31`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${type}${region}${params}${sort}`;
      if (isMounted && !popular) {
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setMovies(data.results);
          });
      }

      if (popular) {
        fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
        if (isMounted)
          await fetch(fullUrl, options)
            .then((res) => res.json())
            .then((data) => {
              if (isMounted) setMovies(data.results);
            });
      }

      if (isMounted) setLoading(false);
    };

    const getTV = async () => {
      setLoading(true);

      var url = "/discover/tv";
      var region = `&watch_region=${locale}`;
      var params = `&first_air_date.gte=${year}-${selectedMonth}-01&first_air_date.lte=${year}-${selectedMonth}-31`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${params}${sort}`;
      if (isMounted && !popular) {
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setMovies(data.results);
          });
      }

      if (popular) {
        fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
        if (isMounted)
          await fetch(fullUrl, options)
            .then((res) => res.json())
            .then((data) => {
              if (isMounted) setMovies(data.results);
            });
      }

      if (isMounted) setLoading(false);
    };

    if (locale) media_type === "movie" ? getMovies() : getTV();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, [media_type, month, year, popular, locale]);

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
        {!popular && (
          <MonthPicker
            month={month}
            year={year}
            setMonth={setMonth}
            setYear={setYear}
            carousel={true}
          />
        )}
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
          timeout={300}
          navButtonsAlwaysVisible
          className={classes.carousel}
          navButtonsProps={{
            style: {
              margin: 0,
              padding: "6px",
              opacity: 0.25,
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
                  locale={locale}
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
