import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import MovieCard from "./movieCard/MovieCard";

const useStyles = makeStyles((theme) => ({
  cards: {
    padding: 0,
    "& > *": {
      width: "100%",
      margin: theme.spacing(0.75),
    },
  },
}));

export default function Movies({
  listID,
  movies,
  deleteMovie,
  moveMovie,
  updating,
  setMessage,
}) {
  const classes = useStyles();
  var title, user;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null, {
    refreshInterval: 2000,
  });
  if (error) console.error(error);
  if (list) {
    ({ movies, title, user } = list);
  }

  const [loc, setLoc] = React.useState("");
  React.useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    // Check if locale is different and get local release date
    const getLocale = async () => {
      await fetch("/api/account/locale", { signal })
        .then((res) => res.json())
        .then((res) => {
          if (isMounted) setLoc(res.data || "US");
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getLocale();

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  return !movies ? (
    <CircularProgress size="3rem" thickness={3} />
  ) : (
    movies
      .sort((a, b) => a.position - b.position)
      .map((movie, index) => (
        <MovieCard
          key={index}
          movie={movie}
          listID={listID}
          listTitle={title}
          loc={loc}
          user={user}
          index={index}
          moviesLength={movies.length}
          deleteMovie={deleteMovie}
          moveMovie={moveMovie}
          updating={updating}
          setMessage={setMessage}
          className={classes.cards}
        />
      ))
  );
}
