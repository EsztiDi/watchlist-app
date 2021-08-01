import Link from "next/link";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  footer: {
    marginTop: "auto",
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    "& > *": {
      margin: `0 ${theme.spacing(1)}px ${theme.spacing(1)}px`,
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
  },
}));

export default function Footer() {
  const classes = useStyles();
  const year = new Date().getFullYear();
  return (
    <Box className={classes.footer}>
      <Typography component="div" className={classes.tmdb}>
        This product uses the TMDb API but is not endorsed or certified by TMDb.
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/tmdb-logo.svg" alt="" width={50} height={21.5} />
        </a>
      </Typography>
      <Typography component="span">
        Copyright &copy; 2021{year > 2021 ? `-${year}` : ""} The Watchlist App
        by Eszter Diana Toth
      </Typography>
      {" | "}
      <Link href="/about">
        <a target="_blank">About & Contact</a>
      </Link>
      {" | "}
      <Link href="/privacy">
        <a target="_blank">Privacy Notice</a>
      </Link>
    </Box>
  );
}
