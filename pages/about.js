import Head from "next/head";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";

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
  return (
    <>
      <Head>
        <title>About - My Watchlists</title>
      </Head>
      <Container maxWidth="md">
        <Paper elevation={4} className={classes.paper}>
          <Typography variant="h4">Contact</Typography>
          <Typography>
            All enquiries, comments, ideas for improvement are welcome.
          </Typography>
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
            This watchlist app is a passion project. Born from the idea of
            having watchlists that are easy to edit and can be shared or even
            edited together with others. Due to having to scroll back in chats
            with my brother just to find the movie link he sent me as a
            recommendation for our next movie night. Then our chat became a
            group chat and there were even more links sent and to be found. :)
          </Typography>
          <Typography>
            I figured there must be an easier way to plan movie nights, so I
            made this app. I hope you enjoy using it!
          </Typography>
          <Typography>
            All movie and TV show information is available thanks to the TMDb
            API. The Movie Database (TMDb) is a community built movie and TV
            database. It is a great platform and I recommend checking it out if
            you are hearing about it for the first time.
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
