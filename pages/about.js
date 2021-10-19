import Head from "next/head";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: "center",
    padding: theme.spacing(2.5),
    "& > p": {
      margin: theme.spacing(2.5),
    },
    "& > h4:not(:first-of-type)": {
      marginTop: theme.spacing(5),
    },
  },
  paperMobile: {
    textAlign: "center",
    padding: theme.spacing(1.25),
    "& > p": {
      margin: `${theme.spacing(2.5)}px ${theme.spacing(1)}px`,
    },
    "& > h4:not(:first-of-type)": {
      marginTop: theme.spacing(5),
    },
  },
  flex: {
    display: "inline-flex",
    alignItems: "center",
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    "& > *:last-child": {
      marginLeft: `${theme.spacing(0.5)}px !important`,
      color: theme.palette.primary.light,
    },
  },
}));

export default function About() {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");

  return (
    <>
      <Head>
        <title>About - My Watchlists</title>
      </Head>
      <Container
        maxWidth="md"
        style={matches ? { padding: "0 8px" } : undefined}
      >
        <Paper
          elevation={4}
          className={matches ? classes.paperMobile : classes.paper}
        >
          <Typography variant="h4">Contact</Typography>
          <Typography>All enquiries, feedback are welcome.</Typography>
          <Typography>
            <b>Email: </b>
            contact@mywatchlists.watch
          </Typography>
          <Typography>
            <b>GitHub: </b>
            <a
              href="https://github.com/EsztiDi/watchlist-app"
              target="_blank"
              rel="noopener noreferrer"
              className={classes.flex}
            >
              EsztiDi <OpenInNewRoundedIcon fontSize="small" />
            </a>
          </Typography>
          <Typography variant="h4">About</Typography>
          <Typography>
            This watchlist app is a passion project of mine. Born from the idea
            of having watchlists that are easy to edit and can be shared or even
            edited together with others. Otherwise, it is a lot of scrolling
            back in group chats with my friends to find the links we sent while
            planning the next movie night. 🎬&nbsp;+&nbsp;🍕
          </Typography>
          <Typography>
            I&apos;m an office worker by day, aspiring web developer by night
            learning all things front-end. :)
          </Typography>
          <Typography>
            All movie and TV show information is available thanks to the TMDb
            API. The Movie Database (TMDb) is a community built movie and TV
            database. They have a great platform, I can definitely recommend
            checking it out.
          </Typography>
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.flex}
          >
            👉 <Image src="/tmdb-logo.svg" alt="" width={75} height={32.25} />
          </a>
        </Paper>
      </Container>
    </>
  );
}
