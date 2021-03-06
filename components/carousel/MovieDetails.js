import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import TheatersRoundedIcon from "@material-ui/icons/TheatersRounded";
import Button from "@material-ui/core/Button";
import PlaylistAddRoundedIcon from "@material-ui/icons/PlaylistAddRounded";

import Overview from "../movieCard/Overview";
import JustWatchLink from "../movieCard/JustWatchLink";
const ListsMenu = dynamic(() => import("./ListsMenu"));

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    overflow: "auto",
    position: "absolute",
    top: 0,
    borderRadius: "10px",
    background: "rgba(0,0,0,0.7)",
    transition: "0.2s",
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    color: "#fff",
    "& > :nth-child(2)": {
      marginTop: theme.spacing(0.75),
      marginBottom: theme.spacing(1),
    },
    "& > details": {
      marginTop: theme.spacing(1.5),
      marginBottom: theme.spacing(1.5),
      "& summary:hover": {
        color: theme.palette.primary.light,
      },
    },
    "& > button": {
      margin: `auto 0 ${theme.spacing(1)}px`,
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
      fontWeight: "bold",
    },
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#CECECE",
      borderRadius: "100px",
    },
  },
  miniIcon: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    verticalAlign: "text-top",
  },
  external: {
    whiteSpace: "nowrap",
    fontWeight: "700",
    lineHeight: 1.6,
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
}));

export default function MovieDetails({
  movie,
  media_type,
  setMessage,
  show,
  handleShowDetails,
  locale,
}) {
  const classes = useStyles();

  const [session, loading] = useSession();
  const router = useRouter();
  const { data: lists, error } = useSWR(session ? "/api/lists" : null);
  const { data: savedLists, error: error2 } = useSWR(
    session ? "/api/lists/saved" : null
  );
  if (error) console.error(error);
  if (error2) console.error(error2);

  const [external_ids, setExternalIDs] = useState({});
  var {
    id,
    title,
    overview,
    release_date,
    vote_average,
    name,
    first_air_date,
  } = movie;

  useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    var baseURL = "https://api.themoviedb.org/3";
    var url = `/${media_type}/${id}/external_ids`;
    var api_key = process.env.TMDB_API_KEY;
    var fullUrl = `${baseURL}${url}?api_key=${api_key}`;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
      signal,
    };

    if (isMounted)
      fetch(fullUrl, options)
        .then((res) => res.json())
        .then((data) => {
          if (isMounted) setExternalIDs({ imdb_id: data.imdb_id || "" });
        });

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!show) handleMenuClose();
  }, [show]);

  var { imdb_id } = external_ids;

  title = title ? title : name ? name : "Untitled";

  release_date = release_date
    ? new Date(release_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : first_air_date
    ? new Date(first_air_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No release date";

  var justWatch =
    release_date === "No release date"
      ? true
      : release_date && new Date(release_date) < new Date();

  // For ListsMenu
  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleButtonClick = () => {
    if (!loading && !session) {
      router?.push("/login");
    } else if (
      lists &&
      lists.length === 0 &&
      savedLists &&
      savedLists.filter((list) => {
        return list?.uid;
      }).length === 0
    ) {
      setMessage("Create a list first.");
    } else {
      setMenuOpen((prevOpen) => !prevOpen);
    }
  };

  const handleMenuClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev?.target)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleListKeyDown = (ev) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      setMenuOpen(false);
    }
  };

  const handleMouse = () => {
    handleShowDetails();
  };

  return (
    <div
      className={classes.details}
      style={!show ? { zIndex: "-99", opacity: 0 } : undefined}
      onMouseLeave={handleMouse}
    >
      <Typography variant="h6" style={{ lineHeight: 1.4 }}>
        {title}
      </Typography>
      <Typography variant="subtitle1">
        {release_date}
        {media_type === "movie" && (
          <Typography
            variant="caption"
            style={{ verticalAlign: "text-bottom" }}
          >
            {" "}
            ({locale})
          </Typography>
        )}
      </Typography>
      <span>
        {vote_average ? (
          <a
            href={`https://www.themoviedb.org/${media_type}/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.external}
          >
            {" "}
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
            {" "}
            <TheatersRoundedIcon className={classes.miniIcon} /> IMDb
          </a>
        )}{" "}
        {justWatch && (
          <JustWatchLink
            locale={locale}
            title={title}
            classes={{ external: classes.external, miniIcon: classes.miniIcon }}
          />
        )}
      </span>
      <Overview overview={overview} carousel={true} />
      <Button
        size="medium"
        color="primary"
        variant="contained"
        ref={anchorRef}
        aria-controls={menuOpen ? "menu-list" : undefined}
        aria-haspopup="true"
        onClick={handleButtonClick}
      >
        <PlaylistAddRoundedIcon />
        &nbsp;Add
      </Button>
      {session && menuOpen && (
        <ListsMenu
          menuOpen={menuOpen}
          anchorEl={anchorRef.current}
          handleMenuClose={handleMenuClose}
          handleListKeyDown={handleListKeyDown}
          movieID={id}
          media_type={media_type}
          locale={locale}
          setMessage={setMessage}
        />
      )}
    </div>
  );
}
