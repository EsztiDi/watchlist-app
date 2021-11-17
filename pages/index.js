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
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
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
        "&:hover svg": {
          color: theme.palette.secondary.main,
        },
      },
    },
    "& li": {
      justifyContent: "center",
      paddingBottom: theme.spacing(0.5),
      "&:hover svg": {
        color: theme.palette.secondary.main,
      },
    },
  },
  listIcon: {
    minWidth: "46px",
  },
  icon: {
    fontSize: "1.9rem",
    color: theme.palette.primary.light,
    transition: "color, fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  },
  text: {
    flex: "unset",
  },
}));

export default function Discover({ session, setMessage }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");

  const [locale, setLocale] = useState("");

  useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const getLocale = async () => {
      if (isMounted)
        await fetch(`/api/account/locale`, { signal })
          .then((res) => res.json())
          .then((res) => {
            if (isMounted) setLocale(res.data || "US");
          })
          .catch((err) => {
            console.error(err);
            if (isMounted) setLocale("US");
          });
    };
    getLocale();

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const carousels = [
    {
      position: 1,
      title: "Movie releases",
      media_type: "movie",
    },
    {
      position: 2,
      title: "New TV shows",
      media_type: "tv",
    },
    {
      position: 3,
      title: "Popular movies",
      media_type: "movie",
      popular: true,
    },
    {
      position: 4,
      title: "Popular TV shows",
      media_type: "tv",
      popular: true,
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
                    <CheckCircleOutlineRoundedIcon className={classes.icon} />
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
                    <CheckCircleOutlineRoundedIcon className={classes.icon} />
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
                media_type={carousel.media_type}
                popular={carousel.popular}
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
