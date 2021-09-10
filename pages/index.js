import Head from "next/head";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MoviesCarousel from "../components/carousel/MoviesCarousel";
import ListsCarousel from "../components/carousel/ListsCarousel";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: theme.spacing(2.5),
  },
  paperMobile: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: theme.spacing(1),
  },
}));

export default function Discover({ setMessage }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");

  const [loading, setLoading] = React.useState(false);
  const [thisMonthMovies, setThisMonthMovies] = React.useState([]);
  const [nextMonthMovies, setNextMonthMovies] = React.useState([]);
  const [popularMovies, setPopularMovies] = React.useState([]);
  const [thisMonthTV, setThisMonthTV] = React.useState([]);
  const [nextMonthTV, setNextMonthTV] = React.useState([]);
  const [popularTV, setPopularTV] = React.useState([]);

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const thisMonth = month < 10 ? `0${month}` : month;
  const nextMonth =
    month === 12 ? "01" : month < 9 ? `0${month + 1}` : month + 1;

  React.useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const getMovies = async () => {
      setLoading(true);

      var country = "US";
      await fetch(
        `https://ipinfo.io/json?token=${
          process.env.APINFO_TOKEN || "ce08a565a65fd0"
        }`,
        {
          signal,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          country = data.country || "US";
        });

      var baseURL = "https://api.themoviedb.org/3";
      var api_key = process.env.TMDB_API_KEY;
      var adult = `&include_adult=false`;
      var type = `&with_release_type=3|2`;
      var region = `&region=${country}`;
      var sort = `&sort_by=popularity.desc`;

      var url = "/discover/movie";
      var params = `&release_date.gte=${year}-${thisMonth}-01&release_date.lte=${year}-${thisMonth}-31`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${type}${region}${params}${sort}`;
      var options = {
        headers: {
          Authorization: process.env.TMDB_BEARER,
          "Content-Type": "application/json;charset=utf-8",
        },
        signal,
      };

      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setThisMonthMovies(data.results);
        });

      params = `&release_date.gte=${year}-${nextMonth}-01&release_date.lte=${year}-${nextMonth}-31`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${type}${region}${params}${sort}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setNextMonthMovies(data.results);
        });

      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setPopularMovies(data.results);
        });

      url = "/discover/tv";
      region = `&watch_region=${country}`;
      params = `&first_air_date.gte=${year}-${thisMonth}-01&first_air_date.lte=${year}-${thisMonth}-31`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${params}${sort}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setThisMonthTV(data.results);
        });

      params = `&first_air_date.gte=${year}-${nextMonth}-01&first_air_date.lte=${year}-${nextMonth}-31`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${params}${sort}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setNextMonthTV(data.results);
        });

      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setPopularTV(data.results);
        });

      if (isMounted) setLoading(false);
    };

    getMovies();

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const carousels = [
    {
      position: 1,
      title: "New movies this month",
      movies: thisMonthMovies,
      media_type: "movie",
    },
    {
      position: 2,
      title: "New movies next month",
      movies: nextMonthMovies,
      media_type: "movie",
    },
    {
      position: 3,
      title: "New TV shows this month",
      movies: thisMonthTV,
      media_type: "tv",
    },
    {
      position: 4,
      title: "New TV shows next month",
      movies: nextMonthTV,
      media_type: "tv",
    },
    {
      position: 5,
      title: "Popular movies",
      movies: popularMovies,
      media_type: "movie",
    },
    {
      position: 6,
      title: "Popular TV shows",
      movies: popularTV,
      media_type: "tv",
    },
  ];

  return (
    <>
      <Head>
        <title>Discover - My Watchlists</title>
      </Head>
      <Paper
        elevation={4}
        className={matches ? classes.paperMobile : classes.paper}
      >
        {carousels
          .sort((a, b) => a.position - b.position)
          .map((carousel, index) => {
            return (
              <MoviesCarousel
                key={index}
                title={carousel.title}
                movies={carousel.movies}
                media_type={carousel.media_type}
                loading={loading}
                setMessage={setMessage}
              />
            );
          })}
        <ListsCarousel setMessage={setMessage} />
      </Paper>
    </>
  );
}
