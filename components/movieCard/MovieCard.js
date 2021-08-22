import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAddRoundedIcon from "@material-ui/icons/PlaylistAddRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import TheatersRoundedIcon from "@material-ui/icons/TheatersRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import VerticalAlignTopRoundedIcon from "@material-ui/icons/VerticalAlignTopRounded";
import VerticalAlignBottomRoundedIcon from "@material-ui/icons/VerticalAlignBottomRounded";
import KeyboardArrowUpRoundedIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

import Overview from "./Overview";
import Seasons from "./Seasons";
import ListsMenu from "../carousel/ListsMenu";

const useStyles = makeStyles((theme) => ({
  moviecard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: theme.spacing(1.5),
    padding: `${theme.spacing(2)}px ${theme.spacing(1.5)}px`,
    textAlign: "left",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: "70%",
    padding: `0 ${theme.spacing(1.5)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  image: {
    minWidth: "16%",
    paddingTop: "24%",
    backgroundSize: "contain",
  },
  title: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    "& > span": {
      flexBasis: "95%",
    },
    "& > button + div": {
      zIndex: "1",
    },
  },
  media: {
    textTransform: "capitalize",
  },
  info: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
    fontSize: "0.9rem",
  },
  nowrap: {
    whiteSpace: "nowrap",
  },
  miniIcon: {
    fontSize: "1rem",
    color: theme.palette.primary.main,
    verticalAlign: "text-top",
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
  director: {
    fontWeight: "normal",
    marginBottom: theme.spacing(0.5),
    fontSize: "0.95rem",
  },
  cast: {
    whiteSpace: "nowrap",
    overflow: "auto",
    fontWeight: "normal",
    marginBottom: theme.spacing(1),
    fontSize: "0.95rem",
    "&::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
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
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bigbutton: {
    padding: theme.spacing(0.8),
  },
  button: {
    padding: theme.spacing(0.5),
  },
  delete: {
    fontSize: "1.8rem",
    color: theme.palette.secondary.light,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  bigarrow: {
    fontSize: "1.5rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  arrow: {
    fontSize: "1.8rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function MovieCard({
  movie,
  index,
  moviesLength,
  deleteMovie,
  moveMovie,
  updating,
  setMessage,
}) {
  const classes = useStyles();

  var {
    id,
    poster_path,
    title,
    release_date,
    year,
    media_type,
    overview,
    details,
    seasons,
    position,
  } = movie;

  if (details) {
    var {
      genres,
      number_of_episodes,
      vote_average,
      external_ids,
      season_number,
      directors,
      creators,
      cast,
      runtime,
    } = details;
  }
  var { imdb_id } = external_ids;

  var poster = poster_path
    ? `https://image.tmdb.org/t/p/w200${poster_path}`
    : "/movieIcon.png";

  // For ListsMenu
  const [session, loading] = useSession();
  const router = useRouter();
  const { data: lists, error } = useSWR(session ? "/api/lists" : null);
  if (error) console.error(error);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleButtonClick = () => {
    if (!loading && !session) {
      router.push("/login");
    } else if (lists && lists.length === 0) {
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

  // For Seasons modal
  const [seasonsOpen, setSeasonsOpen] = React.useState(false);

  const handleSeasonsOpen = () => {
    setSeasonsOpen((prev) => !prev);
  };

  return (
    <>
      <Card id={id} className={classes.moviecard}>
        <CardMedia
          data-image="background"
          className={classes.image}
          image={poster}
        />
        <CardContent className={classes.content}>
          <Typography variant="h6" className={classes.title}>
            <span>{title || "Untitled"}</span>
            <IconButton
              aria-controls={menuOpen ? "menu-list" : undefined}
              aria-haspopup="true"
              aria-label="add to list"
              title="Add to list"
              ref={anchorRef}
              disabled={updating}
              onClick={handleButtonClick}
              className={classes.button}
            >
              <PlaylistAddRoundedIcon className={classes.arrow} />
            </IconButton>
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
                  <Paper>
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
                            setMessage={setMessage}
                            handleMenuClose={handleMenuClose}
                          />
                        )}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Typography>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.info}
          >
            {media_type === "tv" ? (
              `TV series, ${year}– ● `
            ) : (
              <span className={classes.media}>{media_type || "–"} ● </span>
            )}
            {number_of_episodes > 0 && (
              <>
                <span className={classes.external} onClick={handleSeasonsOpen}>
                  {number_of_episodes +
                    (number_of_episodes === 1 ? " episode" : " episodes")}
                </span>
                {" ● "}
                <Seasons
                  open={seasonsOpen}
                  onClose={handleSeasonsOpen}
                  seasons={seasons}
                  lastSeason={season_number}
                />
              </>
            )}
            {number_of_episodes === 0 && (
              <span className={classes.nowrap}>
                {number_of_episodes + " episodes ● "}
              </span>
            )}
            {runtime}
            {runtime && (genres || release_date) && " ● "}
            <span className={classes.nowrap}>{release_date}</span>
            {release_date && genres && " ● "}
            {genres}
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
          </Typography>
          <Typography className={classes.director}>
            {media_type === "tv" ? <b>Created by: </b> : <b>Director: </b>}
            {creators || directors || "-"}
          </Typography>
          <Typography className={classes.cast}>
            <b>Cast: </b>
            {cast || "-"}
          </Typography>
          <Overview overview={overview} />
        </CardContent>
        {deleteMovie && (
          <div className={classes.buttons}>
            {index > 0 && (
              <>
                {index > 1 && (
                  <IconButton
                    aria-label="move to top"
                    title="Move to top"
                    className={classes.bigbutton}
                    disabled={updating}
                    onClick={() => moveMovie("top", index, position)}
                  >
                    <VerticalAlignTopRoundedIcon className={classes.bigarrow} />
                  </IconButton>
                )}
                <IconButton
                  aria-label="move up"
                  title="Move up"
                  className={classes.button}
                  disabled={updating}
                  onClick={() => moveMovie("up", index, position)}
                >
                  <KeyboardArrowUpRoundedIcon className={classes.arrow} />
                </IconButton>
              </>
            )}
            <IconButton
              aria-label="remove"
              title="Remove"
              className={classes.button}
              disabled={updating}
              onClick={() => deleteMovie(index)}
            >
              <HighlightOffRoundedIcon className={classes.delete} />
            </IconButton>
            {index < moviesLength - 1 && (
              <>
                <IconButton
                  aria-label="move down"
                  title="Move down"
                  className={classes.button}
                  disabled={updating}
                  onClick={() => moveMovie("down", index, position)}
                >
                  <KeyboardArrowDownRoundedIcon className={classes.arrow} />
                </IconButton>
                {index < moviesLength - 2 && (
                  <IconButton
                    aria-label="move to bottom"
                    title="Move to bottom"
                    className={classes.bigbutton}
                    disabled={updating}
                    onClick={() => moveMovie("bottom", index, position)}
                  >
                    <VerticalAlignBottomRoundedIcon
                      className={classes.bigarrow}
                    />
                  </IconButton>
                )}
              </>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
