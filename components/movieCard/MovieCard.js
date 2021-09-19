import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";
import getLocalDate from "../../utils/getLocalDate";

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
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import WatchedButton from "./WatchedButton";
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
  moviecardMobile: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    margin: theme.spacing(0),
    marginTop: theme.spacing(1.5),
    padding: `${theme.spacing(1)}px ${theme.spacing(0.75)}px`,
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
  contentMobile: {
    flexGrow: 1,
    width: "50%",
    padding: `0 ${theme.spacing(0.9)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  image: {
    position: "relative",
    minWidth: "16%",
    paddingTop: "24%",
    backgroundSize: "contain",
  },
  imageMobile: {
    position: "relative",
    minWidth: "22%",
    paddingTop: "33%",
    backgroundSize: "contain",
    marginRight: theme.spacing(1),
  },
  title: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& > span": {
      flexBasis: "95%",
    },
    "& > button + div": {
      zIndex: "1",
    },
  },
  new: {
    color: theme.palette.primary.light,
    cursor: "pointer",
    textTransform: "uppercase",
    fontWeight: "bold",
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
  media: {
    textTransform: "capitalize",
  },
  info: {
    textAlign: "center",
    marginBottom: theme.spacing(1),
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
  hidden: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    fontWeight: "normal",
  },
  more: {
    position: "absolute",
    right: 0,
    padding: "3px",
    backgroundColor: "#fff",
    boxShadow: "none",
    minWidth: 0,
    fontWeight: "normal",
    lineHeight: 1.6,
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  less: {
    padding: "3px",
    backgroundColor: "#fff",
    boxShadow: "none",
    minWidth: "45px",
    lineHeight: 1.2,
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  buttonsMobile: {
    flexBasis: "95%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& svg": {
      fontSize: "1.5rem",
    },
    "& > button + div": {
      zIndex: "2",
    },
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
  listID,
  listTitle,
  index,
  moviesLength,
  deleteMovie,
  moveMovie,
  updating,
  setMessage,
}) {
  var {
    id,
    poster_path,
    title,
    release_date,
    year,
    locale,
    media_type,
    overview,
    details,
    seasons,
    position,
    watched,
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

  var newEpisode = /^Watched$/i.test(listTitle) && watched === "false";

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");
  const matches2 = useMediaQuery("(max-width:500px)");
  const contentType = "application/json";
  const isMounted = React.useRef(null);

  const [date, setDate] = React.useState(release_date);
  const [loc, setLoc] = React.useState(locale);

  // For Seasons modal
  const [seasonsOpen, setSeasonsOpen] = React.useState(false);

  const handleSeasonsOpen = () => {
    setSeasonsOpen((prev) => !prev);
  };

  // For directors and cast "more" buttons
  const [overflows1, setOverflows1] = React.useState(false);
  const [overflows2, setOverflows2] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);

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

  React.useEffect(() => {
    const details = document.querySelectorAll("details");
    details.forEach((detail) => {
      detail.removeAttribute("open");
    });
    setMenuOpen(false);
    setSeasonsOpen(false);
    if (visible1) handleLess1();
    if (visible2) handleLess2();
    // eslint-disable-next-line
  }, [id, listID]);

  React.useEffect(() => {
    isMounted.current = true;
    const checkProps = async () => {
      var { release_date, locale } = await getLocalDate(movie);
      if (release_date) {
        if (isMounted.current) setDate(release_date);
        if (isMounted.current) setLoc(locale);
      }

      try {
        const res = await fetch(`/api/lists/watched/check`, {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify({
            id,
            season_number,
          }),
        });

        if (!res.ok) {
          throw new Error(res.status);
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkProps();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    var list1 = document.getElementById(`${id}-directors`);
    var list2 = document.getElementById(`${id}-cast`);
    if (isMounted.current) setOverflows1(list1.offsetWidth < list1.scrollWidth);
    if (isMounted.current) setOverflows2(list2.offsetWidth < list2.scrollWidth);
  }, [id, listID, matches, matches2]);

  const handleMore1 = () => {
    setOverflows1(false);
    setVisible1(true);
    var list1 = document.getElementById(`${id}-directors`);
    list1.style.whiteSpace = "break-spaces";
  };
  const handleMore2 = () => {
    setOverflows2(false);
    setVisible2(true);
    var list2 = document.getElementById(`${id}-cast`);
    list2.style.whiteSpace = "break-spaces";
  };
  const handleLess1 = () => {
    setOverflows1(true);
    setVisible1(false);
    var list1 = document.getElementById(`${id}-directors`);
    if (list1) list1.style.whiteSpace = "nowrap";
  };
  const handleLess2 = () => {
    setOverflows2(true);
    setVisible2(false);
    var list2 = document.getElementById(`${id}-cast`);
    if (list2) list2.style.whiteSpace = "nowrap";
  };

  const handleDelete = async (idx) => {
    if (/^Watched$/i.test(listTitle)) {
      try {
        const res = await fetch(`/api/lists/watched`, {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify({
            watched: "false",
            movieID: id,
            movie,
          }),
        });

        if (!res.ok) {
          throw new Error(res.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
    deleteMovie(idx);
  };

  return (
    <>
      <Card
        id={id}
        className={matches ? classes.moviecardMobile : classes.moviecard}
      >
        <CardMedia
          data-image="background"
          className={matches2 ? classes.imageMobile : classes.image}
          image={poster}
        >
          <WatchedButton movie={movie} />
        </CardMedia>
        <CardContent
          className={matches ? classes.contentMobile : classes.content}
        >
          <Typography
            variant="h6"
            className={classes.title}
            style={
              matches2
                ? { fontSize: "0.9rem" }
                : matches
                ? { fontSize: "1.1rem" }
                : { fontSize: "1.25rem" }
            }
          >
            {newEpisode && (
              <Typography
                variant="caption"
                component="div"
                onClick={handleSeasonsOpen}
                className={classes.new}
                style={{
                  fontSize: matches2 ? "0.65rem" : "0.75rem",
                }}
              >
                New
              </Typography>
            )}
            <span>{title || "Untitled"}</span>
            {(!matches2 || !deleteMovie) && (
              <>
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
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
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
                                movie={movie}
                                setMessage={setMessage}
                              />
                            )}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
          </Typography>

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
            {(number_of_episodes >= 0 || runtime || genres || release_date) &&
              " ● "}
            {number_of_episodes > 0 && (
              <>
                <span className={classes.external} onClick={handleSeasonsOpen}>
                  {number_of_episodes +
                    (number_of_episodes === 1 ? " episode" : " episodes")}
                </span>
                <Seasons
                  open={seasonsOpen}
                  onClose={handleSeasonsOpen}
                  seasons={seasons}
                  lastSeason={season_number}
                  movieID={id}
                />
              </>
            )}
            {number_of_episodes === 0 && (
              <span className={classes.nowrap}>
                {number_of_episodes + " episodes"}
              </span>
            )}
            {number_of_episodes >= 0 &&
              (runtime || genres || release_date) &&
              " ● "}
            {runtime}
            {runtime && (genres || release_date) && " ● "}
            <span className={classes.nowrap}>
              {media_type === "movie" && loc !== locale ? date : release_date}
              {media_type === "movie" && (
                <Typography
                  variant="caption"
                  style={{
                    verticalAlign: "text-bottom",
                    fontSize: matches2
                      ? "0.55rem"
                      : matches
                      ? "0.65rem"
                      : "0.75rem",
                  }}
                >
                  {" "}
                  ({loc !== locale ? loc : locale})
                </Typography>
              )}
            </span>
            {release_date && genres && " ● "}
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
            )}
          </Typography>
          <Typography
            id={`${id}-directors`}
            className={classes.hidden}
            style={matches2 ? { fontSize: "0.8rem" } : { fontSize: "0.95rem" }}
          >
            {media_type === "tv" ? <b>Created by: </b> : <b>Director: </b>}
            {creators || directors || "-"}
            {overflows1 && (
              <Button
                size="small"
                className={classes.more}
                style={
                  matches2 ? { fontSize: "0.6rem" } : { fontSize: "0.7rem" }
                }
                onClick={handleMore1}
              >
                ...More
              </Button>
            )}
            {visible1 && (
              <>
                <br />
                <Button
                  size="small"
                  className={classes.less}
                  style={
                    matches2 ? { fontSize: "0.7rem" } : { fontSize: "0.8rem" }
                  }
                  onClick={handleLess1}
                >
                  Less
                </Button>
              </>
            )}
          </Typography>
          <Typography
            id={`${id}-cast`}
            className={classes.hidden}
            style={matches2 ? { fontSize: "0.8rem" } : { fontSize: "0.95rem" }}
          >
            <b>Cast: </b>
            {cast || "-"}
            {overflows2 && (
              <Button
                size="small"
                className={classes.more}
                style={
                  matches2 ? { fontSize: "0.6rem" } : { fontSize: "0.7rem" }
                }
                onClick={handleMore2}
              >
                ...More
              </Button>
            )}
            {visible2 && (
              <>
                <br />
                <Button
                  size="small"
                  className={classes.less}
                  style={
                    matches2 ? { fontSize: "0.7rem" } : { fontSize: "0.8rem" }
                  }
                  onClick={handleLess2}
                >
                  Less
                </Button>
              </>
            )}
          </Typography>
          <Overview overview={overview} movieCard={true} />
        </CardContent>
        {deleteMovie && (
          <div className={matches2 ? classes.buttonsMobile : classes.buttons}>
            {matches2 && (
              <>
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
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
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
                                movie={movie}
                                setMessage={setMessage}
                              />
                            )}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
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
            {!matches2 && (
              <IconButton
                aria-label="remove"
                title="Remove"
                className={classes.button}
                disabled={updating}
                onClick={() => handleDelete(index)}
              >
                <HighlightOffRoundedIcon className={classes.delete} />
              </IconButton>
            )}
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
            {matches2 && (
              <IconButton
                aria-label="remove"
                title="Remove"
                className={classes.button}
                disabled={updating}
                onClick={() => handleDelete(index)}
              >
                <HighlightOffRoundedIcon className={classes.delete} />
              </IconButton>
            )}
          </div>
        )}
      </Card>
    </>
  );
}
