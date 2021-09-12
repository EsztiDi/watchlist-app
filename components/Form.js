import { useRouter } from "next/router";
import { mutate } from "swr";
import { useSession } from "next-auth/client";

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
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MovieSearch from "./movieSearch/MovieSearch";
import Movies from "./Movies";
import TabPanel from "./tabs/TabPanel";
import ListTabs from "./tabs/ListTabs";

const useStyles = makeStyles((theme) => ({
  create: {
    textAlign: "center",
    padding: theme.spacing(2.5),
  },
  createMobile: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
  grid: {
    "& > *": {
      margin: theme.spacing(1.5),
    },
  },
  gridMobile: {
    "& > *": {
      margin: `${theme.spacing(1.5)}px ${theme.spacing(0)}px`,
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
  list,
  setMessage,
  calendar,
  newList = true,
  newTab = false,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  const router = useRouter();
  var { id } = router.query;
  if (Array.isArray(id)) id = id[0];
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");

  const [session, loading] = useSession();
  const email = session?.user?.email;

  const newMovie = React.useRef(false);
  const [updating, setUpdating] = React.useState(false);
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

      if (newMovie.current) newMovie.current = false;
    }
    // eslint-disable-next-line
  }, [list]);

  React.useEffect(() => {
    if (
      !newList &&
      (form.private !== list.private ||
        form.emails !== list.emails ||
        movies !== list.movies)
    ) {
      setUpdating(true);
      putData(form);
    }
    // eslint-disable-next-line
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

      mutate("/api/lists");
      mutate("/api/lists/newuser", newForm);
      setUpdating(false);
      router.push("/lists");
    } catch (error) {
      setMessage(error.message + " - Failed to add list, please try again.");
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

      await mutate("/api/lists");
      await mutate(`/api/lists/${id}`);
      setTimeout(() => {
        setUpdating(false);
      }, 500);
    } catch (error) {
      setMessage(error.message + " - Failed to update list, please try again.");
      setUpdating(false);
    }
  };

  const postEmail = async (newEmail) => {
    try {
      const res = await fetch("/api/emails/releases", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(newEmail),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      setUpdating(false);
    } catch (error) {
      setMessage(
        error.message + " - Failed to add your email, please try again."
      );
      setUpdating(false);
    }
  };

  const deleteEmail = async (toDelete) => {
    try {
      const res = await fetch("/api/emails/releases", {
        method: "DELETE",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(toDelete),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      setUpdating(false);
    } catch (error) {
      setMessage(
        error.message + " - Failed to remove your email, please try again."
      );
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

    if (target.name === "emails" && target.checked) {
      setUpdating(true);
      postEmail({
        email: email,
        name: session?.user?.name,
      });
    } else if (target.name === "emails" && !target.checked) {
      setUpdating(true);
      deleteEmail({
        email: email,
      });
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUpdating(true);
    postData(form);
  };

  const addMovie = (movie) => {
    if (movies.length > 0) {
      movie.position =
        movies.sort((a, b) => b.position - a.position)[0].position + 1;
    } else {
      movie.position = 0;
    }

    var ids = movies.map((mov) => mov.id);
    if (ids.includes(movie.id)) {
      newMovie.current = false;
      setMessage("It's already on the list \\(^-^)/");
      if (newTab || newList) {
        const yOffset = -56 - 12 + 1;
        const y =
          document.getElementById(movie.id).getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        const yOffset = matches ? -45 - 32 - 64 : -45 - 32 - 16;
        const y = document.getElementById(movie.id).offsetTop + yOffset;
        document
          .getElementById(`tabpanel-${id}`)
          .scrollTo({ top: y, behavior: "smooth" });
      }
    } else {
      setForm({
        ...form,
        movies: [...movies, movie],
      });
      if (!newList) newMovie.current = true;
    }
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
          updating={updating}
          setUpdating={setUpdating}
          putData={putData}
          calendar={calendar}
        />
      )}
      <TabPanel
        id={id}
        newTab={newTab}
        newList={newList}
        updating={updating}
        setUpdating={setUpdating}
        setMessage={setMessage}
        onChange={handleChange}
        addMovie={addMovie}
        deleteMovie={deleteMovie}
        moveMovie={moveMovie}
        addingMovie={newMovie.current}
        calendar={calendar}
      />
    </>
  ) : (
    <Container maxWidth="md" style={matches ? { padding: 0 } : undefined}>
      <Paper
        elevation={4}
        className={matches ? classes.createMobile : classes.create}
      >
        <Typography variant="h4" className={classes.title}>
          New Watchlist
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            direction="column"
            justifyContent="flex-start"
            wrap="nowrap"
            className={matches2 ? classes.gridMobile : classes.grid}
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
              <MovieSearch
                addMovie={addMovie}
                addingMovie={newMovie.current}
                newList={newList}
                setUpdating={setUpdating}
              />
            </Grid>
            {movies.length > 0 && (
              <Grid item className={classes.list}>
                <Movies
                  movies={movies}
                  deleteMovie={deleteMovie}
                  moveMovie={moveMovie}
                  updating={updating}
                  setMessage={setMessage}
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
                can still be shared by you.
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
                Receive an email on Thursdays to {email} of any upcoming
                releases from your watchlist.
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
