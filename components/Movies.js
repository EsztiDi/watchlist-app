import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";

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
}) {
  const classes = useStyles();

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null, {
    refreshInterval: 2000,
  });
  var movies = [];
  if (list) {
    ({ movies } = list);
  }

  return movies
    .sort((a, b) => a.position - b.position)
    .map((movie, index) => (
      <MovieCard
        key={index}
        movie={movie}
        index={index}
        moviesLength={movies.length}
        deleteMovie={deleteMovie}
        moveMovie={moveMovie}
        updating={updating}
        className={classes.cards}
      />
    ));
}
