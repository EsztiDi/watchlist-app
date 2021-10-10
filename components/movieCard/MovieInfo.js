import getLocalDate from "../../utils/getLocalDate";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import TheatersRoundedIcon from "@material-ui/icons/TheatersRounded";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Seasons from "./Seasons";

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
}));

export default function MovieInfo({
  movie,
  listID,
  seasonsOpen,
  handleSeasonsOpen,
}) {
  var { id, title, release_date, year, locale, media_type, details, seasons } =
    movie;

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
  const isMounted = React.useRef(null);

  const [date, setDate] = React.useState("");
  const [loc, setLoc] = React.useState("");

  // For directors and cast "more" buttons
  const [overflows1, setOverflows1] = React.useState(false);
  const [overflows2, setOverflows2] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);

  React.useEffect(() => {
    if (visible1) handleLess1();
    if (visible2) handleLess2();
    // eslint-disable-next-line
  }, [id, listID]);

  React.useEffect(() => {
    isMounted.current = true;
    const controller = new AbortController();
    const signal = controller.signal;

    // Check if locale is different and get local release date
    const checkProps = async () => {
      await fetch("/api/account/locale", { signal })
        .then((res) => res.json())
        .then(async (res) => {
          if (res.data && locale !== res.data) {
            if (window.location.pathname.includes("/lists/")) {
              await fetch("/api/account/locale", {
                method: "PUT",
                headers: {
                  Accept: contentType,
                  "Content-Type": contentType,
                },
                body: JSON.stringify({ loc: res.data }),
              }).catch((err) => {
                console.error(err);
              });
            } else {
              if (isMounted.current) setLoc(res.data);
              var { release_date: localDate } = await getLocalDate(
                movie,
                res.data
              );
              if (localDate && isMounted.current) setDate(localDate);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    };

    if (movie.media_type === "movie") checkProps();

    return () => {
      controller.abort();
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
            style={matches2 ? { fontSize: "0.6rem" } : { fontSize: "0.7rem" }}
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
              style={matches2 ? { fontSize: "0.7rem" } : { fontSize: "0.8rem" }}
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
            style={matches2 ? { fontSize: "0.6rem" } : { fontSize: "0.7rem" }}
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
              style={matches2 ? { fontSize: "0.7rem" } : { fontSize: "0.8rem" }}
              onClick={handleLess2}
            >
              Less
            </Button>
          </>
        )}
      </Typography>
    </>
  );
}
