import Link from "next/link";
import { useRouter } from "next/router";
import { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import MovieSearch from "./movieSearch/MovieSearch";
import Movies from "./Movies";

const useStyles = makeStyles((theme) => ({
  form: {
    flexGrow: 1,
    textAlign: "center",
  },
  create: {
    padding: theme.spacing(2.5),
  },
  grid: {
    "& > *": {
      margin: theme.spacing(1.5),
    },
  },
  title: {
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  relative: {
    position: "relative",
  },
  list: {
    marginTop: 0,
  },
}));

export default function Form({ setMessage, list, newList = true }) {
  const classes = useStyles();
  const router = useRouter();
  const contentType = "application/json";
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    title: list.title,
    movies: list.movies,
    private: list.private,
    emails: list.emails,
  });

  var { movies } = form;

  console.log("form:", form);

  const postData = async (form) => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      setLoading(false);
      router.push("/");
    } catch (error) {
      setMessage(error.message + " - Failed to add list");
      setLoading(false);
    }
  };

  const putData = async (form, id) => {
    // const { id } = router.query

    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { data } = await res.json();

      mutate(`/api/lists/${id}`, data, false); // Update the local data without a revalidation
      setLoading(false);
      router.push("/");
    } catch (error) {
      setMessage(error.message + " - Failed to update list");
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    setLoading(true);

    const target = e.target;
    const value =
      target.name === "private" || target.name === "emails"
        ? target.checked
        : target.value;
    const name = target.name;

    await setForm({
      ...form,
      [name]: value,
    });

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    newList ? postData(form) : putData(form);
  };

  const addMovie = async (movie) => {
    setLoading(true);

    if (movies.length > 0) {
      movie.position =
        movies.sort((a, b) => a.position - b.position)[movies.length - 1]
          .position + 1;
      //   let max = movies.reduce((a, b) =>
      //     a.position > b.position ? a : b
      //   ).position;
      //   movie.position = max + 1;
    } else {
      movie.position = 0;
    }

    await setForm({
      ...form,
      movies: [...movies, movie],
    });

    setLoading(false);
  };

  const deleteMovie = async (index) => {
    setLoading(true);

    await setForm({
      ...form,
      movies: [...movies.filter((movie, i) => i !== index)],
    });

    setLoading(false);
  };

  const moveMovie = async (action, index, position) => {
    setLoading(true);

    // Getting adjacent position
    switch (action) {
      case "up":
        var prevPos = movies[index - 1].position;
        break;
      case "down":
        var nextPos = movies[index + 1].position;
        break;
      default:
        break;
    }

    let updatedMovies = [
      ...movies
        .sort((a, b) => a.position - b.position)
        .map((movie, i) => {
          switch (action) {
            case "top":
              if (movie.position < position) ++movie.position;
              if (i === index) movie.position = 0;
              break;
            case "up":
              if (i === index - 1) movie.position = position;
              if (i === index) movie.position = prevPos;
              break;
            case "down":
              if (i === index) movie.position = nextPos;
              if (i === index + 1) movie.position = position;
              break;
            case "bottom":
              if (i === index) {
                movie.position = movies[movies.length - 1].position + 1;
              }
              break;

            default:
              console.error("Arrow is missing or has wrong 'action' argument");
          }
          return movie;
        }),
    ];

    await setForm({
      ...form,
      movies: updatedMovies,
    });

    setLoading(false);
  };

  return (
    // add tabpanel here, move form out to a new component
    <Container maxWidth="md">
      <Paper elevation={4} className={classes.create}>
        <Typography variant="h5" className={classes.title}>
          New Watchlist
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            wrap="nowrap"
            className={classes.grid}
          >
            <Grid item>
              <TextField
                name="title"
                label="Title"
                value={form.title}
                variant="outlined"
                required
                autoFocus
                fullWidth
                onChange={handleChange}
              />
            </Grid>
            <Grid item className={classes.relative}>
              <MovieSearch addMovie={addMovie} />
            </Grid>
            {movies.length > 0 && (
              <Grid item className={classes.list}>
                <Movies
                  movies={movies}
                  deleteMovie={deleteMovie}
                  moveMovie={moveMovie}
                  loading={loading}
                />
              </Grid>
            )}
            <Grid item>
              <FormControlLabel
                label="Private"
                labelPlacement="start"
                control={
                  <Switch
                    name="private"
                    checked={form.private}
                    onChange={handleChange}
                    color="primary"
                  />
                }
              />
              <Typography variant="subtitle1" color="textSecondary">
                Private lists are <b>not</b> featured on the Discover page but
                can still be shared.
              </Typography>
            </Grid>
            <Grid item>
              <FormControlLabel
                label="Emails"
                labelPlacement="start"
                control={
                  <Switch
                    name="emails"
                    checked={form.emails}
                    onChange={handleChange}
                    color="primary"
                  />
                }
              />
              <Typography variant="subtitle1" color="textSecondary">
                Receive weekly emails of the upcoming releases on your
                watchlist.
              </Typography>
            </Grid>
            <Grid item className={classes.grid}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size="1.5rem" thickness={5} />
                ) : (
                  "Save"
                )}
              </Button>
              <Link href="/lists">
                <Button size="large" variant="contained" color="secondary">
                  Cancel
                </Button>
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
