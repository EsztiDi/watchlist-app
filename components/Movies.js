import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

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

export default function Movies({ movies, deleteMovie, moveMovie, loading }) {
  const classes = useStyles();

  return (
    <List>
      {movies
        .sort((a, b) => a.position - b.position)
        .map((movie, index) => (
          <ListItem key={index} className={classes.cards}>
            <MovieCard
              movie={movie}
              index={index}
              moviesLength={movies.length}
              deleteMovie={deleteMovie}
              moveMovie={moveMovie}
              loading={loading}
            />
          </ListItem>
        ))}
    </List>
  );
}
