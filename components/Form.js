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
import TabPanel from "./tabs/TabPanel";
import ListTabs from "./tabs/ListTabs";

const useStyles = makeStyles((theme) => ({
  form: {
    // flexGrow: 1,
    // textAlign: "center",
  },
  create: {
    textAlign: "center",
    padding: theme.spacing(2.5),
  },
  grid: {
    "& > *": {
      margin: theme.spacing(1.5),
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  relative: {
    position: "relative",
  },
  list: {
    marginTop: 0,
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function Form({
  lists,
  list,
  setMessage,
  newList = true,
  newTab = false,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  const router = useRouter();
  var { id } = router.query;
  if (Array.isArray(id)) id = id[0];

  const [updating, setUpdating] = React.useState(false);
  const newMovie = React.useRef(false);
  const [form, setForm] = React.useState({
    title: list.title,
    movies: list.movies,
    private: list.private,
    emails: list.emails,
  });
  var { movies } = form;

  React.useEffect(() => {
    if (!newList) {
      setForm({
        title: list.title,
        movies: list.movies,
        private: list.private,
        emails: list.emails,
      });

      // if (!newTab) mutate("/api/lists");
      console.log("list effect");

      if (newMovie.current) {
        var panel =
          document.getElementById(`tabpanel-${id}`) ||
          document.querySelector("html");
        panel.style = "scroll-behavior: smooth;";
        panel.scrollTop = panel.scrollHeight;
        newMovie.current = false;
      }
    }
  }, [list]);

  React.useEffect(() => {
    if (
      !newList &&
      (form.private !== list.private ||
        form.emails !== list.emails ||
        movies !== list.movies)
    ) {
      console.log("putData effect", form);
      setUpdating(true);
      putData(form);
    }
  }, [form.private, form.emails, movies]);

  React.useEffect(() => {
    updating
      ? window.addEventListener("beforeunload", unloadAlert)
      : window.removeEventListener("beforeunload", unloadAlert);
  }, [updating]);

  const postData = async (newForm) => {
    try {
      const res = await fetch("/api/lists", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(newForm),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      setUpdating(false);
      router.push("/lists");
    } catch (error) {
      setMessage(error.message + " - Failed to add list");
      setUpdating(false);
    }
  };

  const putData = async (newForm) => {
    try {
      const res = await fetch(`/api/lists/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(newForm),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate("/api/lists");
      // mutate(`/api/lists/${id}`);
      setTimeout(() => {
        setUpdating(false);
      }, 500);
    } catch (error) {
      setMessage(error.message + " - Failed to update list");
      setUpdating(false);
    }
  };

  const handleChange = (ev) => {
    const target = ev.target;
    const value =
      target.name === "private" || target.name === "emails"
        ? target.checked
        : target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUpdating(true);
    postData(form);
  };

  const addMovie = (movie) => {
    if (movies.length > 0) {
      movie.position =
        movies.sort((a, b) => a.position - b.position)[movies.length - 1]
          .position + 1;
    } else {
      movie.position = 0;
    }

    setForm({
      ...form,
      movies: [...movies, movie],
    });

    newMovie.current = true;
  };

  const deleteMovie = (index) => {
    setForm({
      ...form,
      movies: [...movies.filter((movie, i) => i !== index)],
    });
  };

  const moveMovie = (action, index, position) => {
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

    setForm({
      ...form,
      movies: updatedMovies,
    });
  };

  return !newList ? (
    <>
      {!newTab && (
        <ListTabs
          id={id}
          lists={lists}
          updating={updating}
          setUpdating={setUpdating}
          putData={putData}
        />
      )}
      <TabPanel
        list={list}
        newTab={newTab}
        updating={updating}
        setUpdating={setUpdating}
        setMessage={setMessage}
        onChange={handleChange}
        addMovie={addMovie}
        deleteMovie={deleteMovie}
        moveMovie={moveMovie}
      />
    </>
  ) : (
    <Container maxWidth="md">
      <Paper elevation={4} className={classes.create}>
        <Typography variant="h5" className={classes.title}>
          New Watchlist
        </Typography>
        <form onSubmit={handleSubmit}>
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
                  updating={updating}
                />
              </Grid>
            )}
            <Grid item>
              <FormControlLabel
                label="Private"
                labelPlacement="start"
                control={
                  <Switch
                    color="primary"
                    name="private"
                    checked={form.private}
                    onChange={handleChange}
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
                    color="primary"
                    name="emails"
                    checked={form.emails}
                    onChange={handleChange}
                  />
                }
              />
              <Typography variant="subtitle1" color="textSecondary">
                Receive weekly emails of any upcoming releases from your
                watchlist.
              </Typography>
            </Grid>
            <Grid item className={classes.grid}>
              <Button
                type="submit"
                size="large"
                variant="contained"
                color="primary"
                disabled={updating}
              >
                {updating ? (
                  <CircularProgress size="1.5rem" thickness={5} />
                ) : (
                  "Save"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}
