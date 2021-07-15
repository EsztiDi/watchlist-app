import { useRouter } from "next/router";
import { useSession } from "next-auth/client";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import TheatersRoundedIcon from "@material-ui/icons/TheatersRounded";
import Button from "@material-ui/core/Button";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

import Overview from "../movieCard/Overview";
import ListsMenu from "./ListsMenu";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "10px",
    width: "200px",
    height: "300px",
    position: "absolute",
    top: 0,
    background: "rgba(0,0,0,0.6)",
    transition: "0.2s",
    padding: theme.spacing(1),
    color: "#fff",
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(1),
    },
    "& button": {
      margin: `auto 0 ${theme.spacing(1)}px`,
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
      fontWeight: "bold",
    },
    "& button + div": {
      zIndex: "1",
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
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
}));

export default function MovieDetails({
  movie,
  media_type,
  left,
  userLists,
  setMessage,
  show,
  handleShowDetails,
}) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const [external_ids, setExternalIDs] = React.useState({});
  var {
    id,
    title,
    overview,
    release_date,
    vote_average,
    name,
    first_air_date,
  } = movie;

  React.useEffect(() => {
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

    fetch(fullUrl, options)
      .then((res) => res.json())
      .then((data) => {
        setExternalIDs({ imdb_id: data.imdb_id || "" });
      });

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, []);

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

  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleButtonClick = () => {
    if (!loading && !session) {
      router.push("/login");
    } else if (userLists.length === 0) {
      router.push("/create");
    } else {
      setMenuOpen((prevOpen) => !prevOpen);
    }
  };

  const handleMenuClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target)) {
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

  const handleMouse = (ev) => {
    handleShowDetails();
    handleMenuClose(ev);
  };

  return (
    <div
      className={classes.details}
      style={
        !show
          ? { zIndex: "-99", opacity: 0 }
          : left
          ? { left: "26px" }
          : { right: "26px" }
      }
      onMouseLeave={handleMouse}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1">{release_date}</Typography>
      <span>
        {" "}
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
        )}
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
        )}
      </span>
      <Overview overview={overview} height={"92px"} />
      <Button
        size="medium"
        color="primary"
        variant="contained"
        ref={anchorRef}
        aria-controls={menuOpen ? "menu-list" : undefined}
        aria-haspopup="true"
        onClick={handleButtonClick}
      >
        <AddRoundedIcon /> Add
      </Button>
      <Popper
        open={menuOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper className={classes.popup}>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList
                  autoFocus={menuOpen}
                  id="menu-list"
                  onKeyDown={handleListKeyDown}
                >
                  {session && (
                    <ListsMenu
                      movieID={id}
                      media_type={media_type}
                      userLists={userLists}
                      setMessage={setMessage}
                      session={session}
                    />
                  )}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
