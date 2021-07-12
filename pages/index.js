import { getSession } from "next-auth/client";
import dbConnect from "../utils/dbConnect";
import Watchlist from "../models/Watchlist";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import MoviesCarousel from "../components/carousel/MoviesCarousel";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    padding: theme.spacing(2.5),
  },
}));

export default function Discover({ userLists, publicLists, setMessage }) {
  const classes = useStyles();

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
    const controller = new AbortController();
    const signal = controller.signal;

    const getMovies = async () => {
      setLoading(true);

      var baseURL = "https://api.themoviedb.org/3";
      var url = "/discover/movie";
      var api_key = process.env.TMDB_API_KEY;
      var params = `&include_adult=false&primary_release_date.gte=${year}-${thisMonth}-01&primary_release_date.lte=${year}-${thisMonth}-31&sort_by=popularity.desc`;
      var fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
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
          setThisMonthMovies(data.results);
        });

      params = `&include_adult=false&primary_release_date.gte=${year}-${nextMonth}-01&primary_release_date.lte=${year}-${nextMonth}-31&sort_by=popularity.desc`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          setNextMonthMovies(data.results);
        });

      params = `&include_adult=false&sort_by=popularity.desc`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          setPopularMovies(data.results);
        });

      url = "/discover/tv";
      params = `&include_adult=false&first_air_date.gte=${year}-${thisMonth}-01&first_air_date.lte=${year}-${thisMonth}-31&sort_by=popularity.desc`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          setThisMonthTV(data.results);
        });

      params = `&include_adult=false&first_air_date.gte=${year}-${nextMonth}-01&first_air_date.lte=${year}-${nextMonth}-31&sort_by=popularity.desc`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          setNextMonthTV(data.results);
        });

      params = `&include_adult=false&sort_by=popularity.desc`;
      fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
      await fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          setPopularTV(data.results);
        });

      setLoading(false);
    };

    getMovies();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Container disableGutters maxWidth="xl">
      <Paper elevation={4} className={classes.paper}>
        <MoviesCarousel
          title="New movies this month"
          movies={thisMonthMovies}
          media_type={"movie"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
        <MoviesCarousel
          title="New movies next month"
          movies={nextMonthMovies}
          media_type={"movie"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
        <MoviesCarousel
          title="New TV shows this month"
          movies={thisMonthTV}
          media_type={"tv"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
        <MoviesCarousel
          title="New TV shows next month"
          movies={nextMonthTV}
          media_type={"tv"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
        <MoviesCarousel
          title="Popular movies"
          movies={popularMovies}
          media_type={"movie"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
        <MoviesCarousel
          title="Popular TV shows"
          movies={popularTV}
          media_type={"tv"}
          loading={loading}
          userLists={userLists}
          setMessage={setMessage}
        />
      </Paper>
    </Container>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  await dbConnect();

  var userLists = [];
  var publicLists = [];

  if (session) {
    var userResults = await Watchlist.find(
      { user: session.user },
      "_id title movies"
    ).sort({
      position: 1,
    });
    userLists = await JSON.parse(JSON.stringify(userResults));
  }

  var results = await Watchlist.find({ private: false }, "_id title movies", {
    skip: 0,
    limit: 10,
    sort: {
      updatedAt: -1,
    },
  });
  publicLists = await JSON.parse(JSON.stringify(results));

  return { props: { userLists, publicLists } };
}
