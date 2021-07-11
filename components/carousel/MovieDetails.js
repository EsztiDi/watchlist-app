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
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

import Overview from "../movieCard/Overview";

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
    opacity: 0,
    transition: "0.2s",
    padding: theme.spacing(1),
    color: "#fff",
    cursor: "default",
    "& a": {
      position: "relative",
      zIndex: "-99",
    },
    "&:hover": {
      opacity: 1,
      "& a": {
        zIndex: "0",
      },
      "& button": {
        zIndex: "0",
      },
    },
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(1),
    },
    "& button": {
      margin: `auto 0 ${theme.spacing(1)}px`,
      padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
      fontWeight: "bold",
      position: "relative",
      zIndex: "-99",
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

export default function MovieDetails({ movie, media_type, left }) {
  const classes = useStyles();
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
    var baseURL = "https://api.themoviedb.org/3";
    var url = `/${media_type}/${id}/external_ids`;
    var api_key = process.env.TMDB_API_KEY;
    var fullUrl = `${baseURL}${url}?api_key=${api_key}`;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    fetch(fullUrl, options)
      .then((res) => res.json())
      .then((data) => {
        setExternalIDs(data);
      });
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

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
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

    if (ev.key === "Enter") {
      document.activeElement.click();
    }
  };

  // Return focus to button when menu is closed
  const prevOpen = React.useRef(menuOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && menuOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <div
      className={classes.details}
      style={left ? { left: "26px" } : { right: "26px" }}
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
        onClick={handleMenuToggle}
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
                  <MenuItem onClick={handleMenuClose}>
                    <Typography variant="button" className={classes.menuItem}>
                      List1
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography variant="button" className={classes.menuItem}>
                      List2
                    </Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
