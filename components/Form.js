import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
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
  openSearch2, // For ListPage titlebar
  setUpdating2, // For ListPage titlebar
  newList = true,
  newTab = false,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  const router = useRouter();
  var uid;
  var { id } = router?.query;
  if (Array.isArray(id)) {
    uid = id[1] ? id[1] : "";
    id = id[0];
  }
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");

  const [session] = useSession();
  const email = session?.user?.email;
  const auth = list?.user ? session && list?.user?.email === email : true;

  const { data: savedList, error: error2 } = useSWR(
    newList || newTab ? null : !auth && id ? `/api/lists/saved/${id}` : null
  );
  if (error2) console.error(error2);

  useEffect(() => {
    if (error2) {
      setMessage("This list has been removed.");
    }
    // eslint-disable-next-line
  }, [error2]);

  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({
    title: list.title,
    movies: list.movies,
    private: list.private,
    emails: list.emails,
  });
  var { movies } = form;

  useEffect(() => {
    if (!newList) {
      setForm({
        title: list.title,
        movies: list.movies,
        private: list.private,
        emails: savedList ? savedList.emails : list.emails,
      });
    }
    // eslint-disable-next-line
  }, [list, savedList]);

  useEffect(() => {
    const beforeRouteHandler = (url) => {
      if (
        router?.pathname !== url &&
        !confirm("Changes that you made may not be saved.")
      ) {
        router?.events?.emit("routeChangeError");
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    if (updating) {
      window.addEventListener("beforeunload", unloadAlert);
      router?.events?.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    };
    // eslint-disable-next-line
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
        throw new Error(res.statusText || res.status);
      }

      mutate("/api/lists", (lists) => {
        if (lists) {
          mutate("/api/lists/newuser", (data) => {
            return { ...data, id: lists[0]?.listid };
          });
        }
        return lists;
      });
      setUpdating(false);
      router?.push("/lists");
    } catch (error) {
      setMessage(`${error.message} - Failed to add list, please try again.`);
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

      mutate(`/api/lists/${id}`);
      mutate(`/api/lists/saved/${id}`);
      if (
        newForm.hasOwnProperty("position") ||
        newForm.hasOwnProperty("title")
      ) {
        mutate("/api/lists");
        mutate("/api/lists/saved");
      }
      setTimeout(() => {
        setUpdating(false);
        if (setUpdating2) setUpdating2(false);
      }, 500);
    } catch (error) {
      setMessage(`${error.message} - Failed to update list, please try again.`);
      setUpdating(false);
      if (setUpdating2) setUpdating2(false);
    }
  };

  const updateSavedList = async (list) => {
    try {
      const res = await fetch(`/api/lists/saved/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(list),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate(`/api/lists/${id}`);
      mutate(`/api/lists/saved/${id}`);
      if (list.hasOwnProperty("position") || list.hasOwnProperty("title")) {
        mutate("/api/lists");
        mutate("/api/lists/saved");
      }
      setTimeout(() => {
        setUpdating(false);
        if (setUpdating2) setUpdating2(false);
      }, 500);
    } catch (error) {
      setMessage(`${error.message} - Failed to update list, please try again.`);
      setUpdating(false);
      if (setUpdating2) setUpdating2(false);
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
        `${error.message} - Failed to add your email, please try again.`
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
        `${error.message} - Failed to remove your email, please try again.`
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

    if (name === "emails" && target.checked) {
      setUpdating(true);
      postEmail({
        email: email,
        name: session?.user?.name,
        listid: id ? id : "",
        uid: uid ? uid : "",
        savedList: auth ? false : true,
      });
    } else if (name === "emails" && !target.checked) {
      setUpdating(true);
      deleteEmail({
        email: email,
        listid: id ? id : "",
      });
    }
    if (!newList) {
      switch (name) {
        case "private":
          setUpdating(true);
          putData({ private: value });
          break;
        case "emails":
          setUpdating(true);
          auth
            ? putData({ emails: value })
            : updateSavedList({ emails: value });
          break;
        default:
          console.error("HandleChange has missing 'name'");
      }
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUpdating(true);
    postData(form);
  };

  const addMovie = async (movie) => {
    if (movies.length > 0) {
      movie.position =
        movies.sort((a, b) => b.position - a.position)[0].position + 1;
    } else {
      movie.position = 0;
    }

    var ids = movies.map((mov) => mov.id);
    if (ids?.includes(movie.id)) {
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      if (!newList) {
        setUpdating(true);
        if (setUpdating2) setUpdating2(true);
        putData({ movies: [...movies, movie] });
      } else {
        setForm({
          ...form,
          movies: [...movies, movie],
        });
      }
    }
  };

  const deleteMovie = (index) => {
    let updatedMovies = [...movies.filter((movie, i) => i !== index)];

    if (!newList) {
      setUpdating(true);
      if (setUpdating2) setUpdating2(true);
      putData({ movies: updatedMovies });
    } else {
      setForm({
        ...form,
        movies: updatedMovies,
      });
    }
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
        .sort((a, b) => b.position - a.position)
        .map((movie, i, arr) => {
          switch (action) {
            case "top":
              if (i === index) {
                movie.position =
                  movies.sort((a, b) => b.position - a.position)[0].position +
                  1;
              }
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
              if (movie.position < position) ++movie.position;
              if (i === index) movie.position = 0;
              break;

            default:
              console.error("Arrow is missing or has wrong 'action' argument");
          }
          return movie;
        }),
    ];
    if (!newList) {
      setUpdating(true);
      if (setUpdating2) setUpdating2(true);
      putData({ movies: updatedMovies });
    } else {
      setForm({
        ...form,
        movies: updatedMovies,
      });
    }
  };

  return !newList ? (
    <>
      {!newTab && (
        <ListTabs
          id={id}
          updating={updating}
          setUpdating={setUpdating}
          putData={putData}
          updateSavedList={updateSavedList}
          calendar={calendar}
          title={form.title}
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
        calendar={calendar}
        emails={form.emails}
        openSearch2={openSearch2}
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
                newList={newList}
                setUpdating={setUpdating}
                watched={/^Watched$/i.test(form.title).toString()}
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
