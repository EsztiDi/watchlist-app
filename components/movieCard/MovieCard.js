import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Seasons from "./Seasons";
import WatchedButton from "./buttons/WatchedButton";
import AddButton from "./buttons/AddButton";
import MovieInfo from "./MovieInfo";
import Overview from "./Overview";
import Buttons from "./buttons/Buttons";

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
    display: "grid",
    gridTemplateColumns: "auto auto 1fr auto",
    placeItems: "center",
    textAlign: "center",
    "& > button:first-child": {
      minWidth: "auto",
      lineHeight: 1,
      padding: `${theme.spacing(0.6)}px ${theme.spacing(1)}px`,
    },
    "& > span": {
      gridArea: "1 / 3 / 2 / 4",
    },
    "& > button:last-child": {
      gridArea: "1 / 4 / 2 / 5",
    },
  },
  new: {
    color: theme.palette.primary.main,
    textTransform: "uppercase",
    marginLeft: theme.spacing(0.75),
  },
}));

export default function MovieCard({
  movie,
  listID,
  listTitle,
  user,
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
    media_type,
    overview,
    details,
    seasons,
    watched,
  } = movie;

  if (details) {
    var { season_number, number_of_episodes } = details;
  }
  var poster = poster_path
    ? `https://image.tmdb.org/t/p/w200${poster_path}`
    : "/movieIcon.png";

  var newEpisode = /^Watched$/i.test(listTitle) && watched === "false";

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");
  const matches2 = useMediaQuery("(max-width:500px)");
  const contentType = "application/json";
  const isMounted = React.useRef(null);

  // For Seasons modal
  const [seasonsOpen, setSeasonsOpen] = React.useState(false);

  const handleSeasonsOpen = () => {
    setSeasonsOpen((prev) => !prev);
  };

  React.useEffect(() => {
    const details = document.querySelectorAll("details");
    details.forEach((detail) => {
      detail.removeAttribute("open");
    });

    setSeasonsOpen(false);
    // eslint-disable-next-line
  }, [id, listID]);

  React.useEffect(() => {
    isMounted.current = true;
    const checkProps = async () => {
      if (media_type === "tv") {
        try {
          const res = await fetch(`/api/lists/watched/check`, {
            method: "POST",
            headers: {
              Accept: contentType,
              "Content-Type": contentType,
            },
            body: JSON.stringify({
              movieID: id,
              season_number,
              listID,
            }),
          });

          if (!res.ok) {
            throw new Error(res.status);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkProps();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

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
            {number_of_episodes > 0 && (
              <>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleSeasonsOpen}
                  style={{
                    fontSize: matches2 ? "0.65rem" : "0.75rem",
                  }}
                >
                  {number_of_episodes + (matches2 ? " ep" : " episodes")}
                </Button>
                <Seasons
                  open={seasonsOpen}
                  onClose={handleSeasonsOpen}
                  seasons={seasons}
                  lastSeason={season_number}
                  movieID={id}
                />
              </>
            )}
            {newEpisode && (
              <Typography
                variant="caption"
                component="div"
                className={classes.new}
                style={{
                  fontSize: matches2 ? "0.6rem" : "0.7rem",
                }}
              >
                New
              </Typography>
            )}
            <span>{title || "Untitled"}</span>
            {(!matches2 || !deleteMovie) && (
              <AddButton
                movie={movie}
                updating={updating}
                setMessage={setMessage}
              />
            )}
          </Typography>

          <MovieInfo movie={movie} listID={listID} user={user} />
          <Overview overview={overview} movieCard={true} />
        </CardContent>
        {deleteMovie && (
          <Buttons
            movie={movie}
            index={index}
            moviesLength={moviesLength}
            deleteMovie={deleteMovie}
            moveMovie={moveMovie}
            updating={updating}
            setMessage={setMessage}
          />
        )}
      </Card>
    </>
  );
}
