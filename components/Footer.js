import Link from "next/link";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  footer: {
    width: "100%",
    marginTop: "auto",
    paddingTop: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary,
    "& > *": {
      margin: theme.spacing(1),
      fontSize: "0.88rem",
    },
    "& a": {
      transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      "&:hover": {
        color: theme.palette.text.primary,
      },
    },
  },
  tmdb: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& > *": {
      lineHeight: 0,
      marginLeft: theme.spacing(1),
    },
    "& > a": {
      minWidth: "50px",
    },
  },
}));

export default function Footer() {
  const classes = useStyles();
  const year = new Date().getFullYear();
  return (
    <Box className={classes.footer}>
      <Typography style={{ fontSize: "0.95rem" }} data-nosnippet>
        <Link href="/about">
          <a>About & Contact</a>
        </Link>
        {" | "}
        <Link href="/privacy">
          <a>Privacy Notice</a>
        </Link>
      </Typography>
      <Typography component="span" data-nosnippet>
        Copyright &copy; 2021{year > 2021 ? `-${year}` : ""}, The Watchlist App
        by Eszter Diana Toth
      </Typography>
      <Typography component="div" className={classes.tmdb} data-nosnippet>
        This product uses the TMDb API but is not endorsed or certified by TMDb.
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/tmdb-logo.svg" alt="" width={50} height={21.5} />
        </a>
      </Typography>
    </Box>
  );
}
