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

  const [locale, setLocale] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [thisMonthMovies, setThisMonthMovies] = React.useState([]);
  const [nextMonthMovies, setNextMonthMovies] = React.useState([]);
  const [popularMovies, setPopularMovies] = React.useState([]);
  const [thisMonthTV, setThisMonthTV] = React.useState([]);
  const [nextMonthTV, setNextMonthTV] = React.useState([]);
  const [popularTV, setPopularTV] = React.useState([]);

  React.useEffect(() => {
    var isMounted = true;

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const thisMonth = month < 10 ? `0${month}` : month;
    const nextMonth =
      month === 12 ? "01" : month < 9 ? `0${month + 1}` : month + 1;

    const controller = new AbortController();
    const signal = controller.signal;

    const getLocale = async () => {
      setLoading(true);
      var locale2;
      if (isMounted)
        await fetch(`/api/account/locale`, { signal })
          .then((res) => res.json())
          .then((res) => {
            locale2 = res.data || "US";
            if (isMounted) setLocale(res.data || "US");
          })
          .catch((err) => {
            console.error(err);
            locale2 = "US";
            if (isMounted) setLocale("US");
          });
      if (isMounted) setLoading(false);
      return locale2;
    };

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

      var locale2 = await getLocale();
      var url = "/discover/movie";
      var region = `&region=${locale2}`;
      var params = `&release_date.gte=${year}-${thisMonth}-01&release_date.lte=${year}-${thisMonth}-31`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${type}${region}${params}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setThisMonthMovies(data.results);
          });

      params = `&release_date.gte=${year}-${nextMonth}-01&release_date.lte=${year}-${nextMonth}-31`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${type}${region}${params}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setNextMonthMovies(data.results);
          });

      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setPopularMovies(data.results);
          });

      if (isMounted) setLoading(false);
    };

    const getTV = async () => {
      setLoading(true);

      var locale2 = await getLocale();
      var url = "/discover/tv";
      var region = `&watch_region=${locale2}`;
      var params = `&first_air_date.gte=${year}-${thisMonth}-01&first_air_date.lte=${year}-${thisMonth}-31`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${params}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setThisMonthTV(data.results);
          });

      params = `&first_air_date.gte=${year}-${nextMonth}-01&first_air_date.lte=${year}-${nextMonth}-31`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${params}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setNextMonthTV(data.results);
          });

      fullUrl = `${baseURL}${url}?api_key=${api_key}${adult}${region}${sort}`;
      if (isMounted)
        await fetch(fullUrl, options)
          .then((res) => res.json())
          .then((data) => {
            if (isMounted) setPopularTV(data.results);
          });

      if (isMounted) setLoading(false);
    };

    getMovies();
    getTV();

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
                locale={locale}
                setMessage={setMessage}
              />
            );
          })}
        <ListsCarousel setMessage={setMessage} />
      </Paper>
    </>
  );
}
