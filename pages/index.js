import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getSession } from "next-auth/client";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import MailOutlineRoundedIcon from "@material-ui/icons/MailOutlineRounded";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";
import TodayRoundedIcon from "@material-ui/icons/TodayRounded";
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
  welcome: {
    flexBasis: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
    textAlign: "center",
    "& > h5": {
      fontFamily: "'Carter One', cursive",
      background: `-webkit-linear-gradient(0deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark} 90%)`,
      "-webkit-background-clip": "text",
      "-webkit-text-fill-color": "transparent",
    },
    "& a": {
      textDecoration: "underline",
      fontWeight: "bold",
    },
    "& > div": {
      padding: `${theme.spacing(1.5)}px 0`,
      fontSize: "0.95rem",
    },
    "& > h6:first-of-type": {
      padding: `${theme.spacing(1)}px 0`,
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      columnGap: theme.spacing(3),
      rowGap: theme.spacing(1.5),
      "& > :last-child": {
        flexBasis: "100%",
      },
      "& > span": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing(1.5),
      },
    },
    "& li": {
      justifyContent: "center",
      paddingBottom: theme.spacing(0.5),
    },
  },
  listIcon: {
    minWidth: "46px",
  },
  icon: {
    fontSize: "1.9rem",
    color: theme.palette.primary.light,
  },
  text: {
    flex: "unset",
  },
}));

export default function Discover({ session, setMessage }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");

  const [locale, setLocale] = useState("");
  const [loading, setLoading] = useState(false);
  const [thisMonthMovies, setThisMonthMovies] = useState([]);
  const [nextMonthMovies, setNextMonthMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [thisMonthTV, setThisMonthTV] = useState([]);
  const [nextMonthTV, setNextMonthTV] = useState([]);
  const [popularTV, setPopularTV] = useState([]);

  useEffect(() => {
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
        {!session && (
          <Paper
            elevation={1}
            className={classes.welcome}
            style={matches ? { maxWidth: "560px" } : { maxWidth: "970px" }}
          >
            <Typography variant="h5">Welcome to The Watchlist App!</Typography>
            <Typography variant="button" component="div">
              <Link href="/login">
                <a>Log in</a>
              </Link>{" "}
              to create or save watchlists
            </Typography>
            {matches ? (
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon
                    classes={{
                      root: classes.listIcon,
                    }}
                  >
                    <ShareRoundedIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary='Plan movie nights with the "share to edit" option'
                    classes={{
                      root: classes.text,
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon
                    classes={{
                      root: classes.listIcon,
                    }}
                  >
                    <MailOutlineRoundedIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Receive a weekly summary of upcoming releases from your lists"
                    classes={{
                      root: classes.text,
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon
                    classes={{
                      root: classes.listIcon,
                    }}
                  >
                    <FormatListBulletedRoundedIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Track the TV shows you are watching"
                    classes={{
                      root: classes.text,
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon
                    classes={{
                      root: classes.listIcon,
                    }}
                  >
                    <TodayRoundedIcon className={classes.icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary="And see the releases in calendar view"
                    classes={{
                      root: classes.text,
                    }}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemText
                    primary="Enjoy!&nbsp;🎬&nbsp;+&nbsp;🍕"
                    classes={{
                      root: classes.text,
                    }}
                  />
                </ListItem>
              </List>
            ) : (
              <>
                <Typography variant="subtitle1">
                  <span>
                    <ShareRoundedIcon className={classes.icon} />
                    Plan movie nights with the &quot;share to edit&quot; option
                  </span>
                  <span>
                    <MailOutlineRoundedIcon className={classes.icon} />
                    Receive a weekly summary of upcoming releases from your
                    lists
                  </span>
                  <span>
                    <FormatListBulletedRoundedIcon className={classes.icon} />
                    Track the TV shows you are watching
                  </span>
                  <span>
                    <TodayRoundedIcon className={classes.icon} />
                    And see the releases in calendar view
                  </span>
                  <span>Enjoy!&nbsp;🎬&nbsp;+&nbsp;🍕</span>
                </Typography>
              </>
            )}
          </Paper>
        )}

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

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}
