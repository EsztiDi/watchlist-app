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
  var title;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null, {
    refreshInterval: 2000,
  });
  if (error) console.error(error);
  if (list) {
    ({ movies, title } = list);
  }

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
