import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/client";

import getLocalDate from "../../utils/getLocalDate";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import TheatersRoundedIcon from "@material-ui/icons/TheatersRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Cast from "./Cast";

const useStyles = makeStyles((theme) => ({
  info: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
  },
  media: {
    textTransform: "capitalize",
  },
  external: {
    cursor: "pointer",
    whiteSpace: "nowrap",
    color: theme.palette.text.secondary,
    fontWeight: "700",
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.text.primary,
    },
  },
  nowrap: {
    whiteSpace: "nowrap",
  },
  miniIcon: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    verticalAlign: "text-top",
  },
}));

export default function MovieInfo({ movie, listID, loc, user }) {
  var { id, title, release_date, year, locale, media_type, details } = movie;

  if (details) {
    var {
      genres,
      number_of_episodes,
      vote_average,
      external_ids,
      directors,
      creators,
      cast,
      runtime,
    } = details;
  }
  release_date = release_date || "No date";
  var { imdb_id } = external_ids;
  var countries = [
    "AU",
    "BG",
    "CA",
    "DK",
    "GR",
    "HK",
    "HU",
    "ID",
    "IE",
    "IN",
    "LT",
    "LV",
    "MY",
    "NL",
    "NO",
    "NZ",
    "PH",
    "PL",
    "RO",
    "SE",
    "SG",
    "TH",
    "TW",
    "US",
    "ZA",
  ];
  var justWatchLink = `https://www.justwatch.com/${
    loc === "GB" || locale === "GB"
      ? "UK"
      : countries.includes(loc)
      ? loc
      : countries.includes(locale)
      ? locale
      : "us"
  }/search?q=${encodeURIComponent(title)}`;

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");
  const matches2 = useMediaQuery("(max-width:500px)");
  const contentType = "application/json";
  const isMounted = useRef(null);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const [session] = useSession();
  const auth = user ? session && user?.email === session?.user?.email : false;

  const [date, setDate] = useState("");

  useEffect(() => {
    // Check if locale is different and get local release date
    const checkProps = async () => {
      if (loc && locale !== loc) {
        if (auth) {
          await fetch("/api/account/locale", {
            method: "PUT",
            headers: {
              Accept: contentType,
              "Content-Type": contentType,
            },
            body: JSON.stringify({ loc }),
          }).catch((err) => {
            console.error(err);
          });
        } else {
          var { release_date: localDate } = await getLocalDate(movie, loc);
          if (localDate && isMounted.current) setDate(localDate);
        }
      }
    };

    if (movie.media_type === "movie" && auth !== undefined && loc) checkProps();
    // eslint-disable-next-line
  }, [auth, loc]);

  return (
    <>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        className={classes.info}
        style={
          matches2
            ? { fontSize: "0.7rem" }
            : matches
            ? { fontSize: "0.8rem" }
            : { fontSize: "0.9rem" }
        }
      >
        {media_type === "tv" ? (
          `TV series, ${year}–`
        ) : (
          <span className={classes.media}>{media_type || "–"}</span>
        )}
        {(number_of_episodes === 0 || runtime || genres || release_date) &&
          " ● "}
        {number_of_episodes === 0 && (
          <span className={classes.nowrap}>
            {number_of_episodes + " episodes"}
          </span>
        )}
        {number_of_episodes === 0 &&
          (runtime || genres || release_date) &&
          " ● "}
        {runtime}
        {runtime && (genres || release_date) && " ● "}
        <span className={classes.nowrap}>
          {media_type === "movie" && date ? date : release_date}
          {media_type === "movie" && (
            <Typography
              variant="caption"
              style={{
                verticalAlign: "top",
                fontSize: matches2
                  ? "0.55rem"
                  : matches
                  ? "0.65rem"
                  : "0.75rem",
              }}
            >
              {" "}
              ({loc ? loc : locale})
            </Typography>
          )}
        </span>
        {(release_date || date) && genres && " ● "}
        {genres}{" "}
        {vote_average ? (
          <a
            href={`https://www.themoviedb.org/${media_type}/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.external}
          >
            <StarRoundedIcon className={classes.miniIcon} /> {vote_average}{" "}
            (TMDb)
          </a>
        ) : (
          ""
        )}{" "}
        {imdb_id && (
          <a
            href={`https://www.imdb.com/title/${imdb_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.external}
          >
            <TheatersRoundedIcon className={classes.miniIcon} /> IMDb
          </a>
        )}{" "}
        <a
          href={justWatchLink}
          target="_blank"
          rel="noopener noreferrer"
          className={classes.external}
        >
          <PlayArrowRoundedIcon className={classes.miniIcon} />
          JustWatch
        </a>
      </Typography>
      <Cast
        variant="directors"
        media_type={media_type}
        creators={creators}
        directors={directors}
        id={id}
        listID={listID}
      />
      <Cast variant="cast" cast={cast} id={id} listID={listID} />
    </>
  );
}
