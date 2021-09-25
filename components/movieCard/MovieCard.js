import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import WatchedButton from "./buttons/WatchedButton";
import AddButton from "./buttons/AddButton";
import Info from "./Info";
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
  var { id, poster_path, title, media_type, overview, details, watched } =
    movie;

  if (details) {
    var { season_number } = details;
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
              <AddButton
                movie={movie}
                updating={updating}
                setMessage={setMessage}
              />
            )}
          </Typography>

          <Info
            movie={movie}
            listID={listID}
            seasonsOpen={seasonsOpen}
            handleSeasonsOpen={handleSeasonsOpen}
          />
          <Overview overview={overview} movieCard={true} />
        </CardContent>
        {deleteMovie && (
          <Buttons
            movie={movie}
            listTitle={listTitle}
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
