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
  loc,
  movies,
  deleteMovie,
  moveMovie,
  updating,
  setMessage,
}) {
  const classes = useStyles();
  var title, user;

  const { data: shared, error: error2 } = useSWR(
    listID ? `/api/lists/shared/${listID}` : null
  );
  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null, {
    refreshInterval: shared ? 2000 : 0,
  });
  if (error) console.error(error);
  if (error2) console.error(error2);
  if (list) {
    ({ movies, title, user } = list);
  }
  return !movies ? (
    <CircularProgress size="3rem" thickness={3} />
  ) : (
    movies
      .sort((a, b) => b.position - a.position)
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
