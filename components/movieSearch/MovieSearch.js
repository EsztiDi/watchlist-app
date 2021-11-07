import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import getDetails from "../../utils/getDetails";

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Dropdown from "./Dropdown";
import DropdownModal from "./DropdownModal";

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function MovieSearch({
  addMovie,
  addingMovie,
  newList,
  setUpdating,
  listID,
}) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:350px)");
  const router = useRouter();

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

    if (loading) {
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
  }, [loading]);

  useEffect(() => {
    var input = document.getElementById(`${listID}-input`);
    if (listID) {
      return () => {
        input.value = "";
      };
    }
  }, [listID]);

  const handleMessage = () => {
    setMessage("");
  };

  const updateQuery = (ev) => {
    setQuery(ev.target.value);
    setMessage("");
  };

  const getResults = (keyword) => {
    setLoading(true);
    if (newList) setUpdating(true);

    var baseURL = "https://api.themoviedb.org/3";
    var url = "/search/multi";
    var api_key = process.env.TMDB_API_KEY;
    var params = "&include_adult=false";
    var fullUrl = `${baseURL}${url}?api_key=${api_key}&query=${encodeURIComponent(
      keyword
    )}${params}`;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    fetch(fullUrl, options)
      .then((res) => res.json())
      .then((data) => {
        let first = data.results.filter((el) => el.media_type !== "person");

        if (data.total_pages > 1) {
          params = "&include_adult=false&page=2";
          fullUrl = `${baseURL}${url}?api_key=${api_key}&query=${encodeURIComponent(
            keyword
          )}${params}`;

          fetch(fullUrl, options)
            .then((res) => res.json())
            .then((data) => {
              let second = data.results.filter(
                (el) => el.media_type !== "person"
              );
              setResults(first.concat(second));

              if (data.total_pages > 2) {
                params = "&include_adult=false&page=3";
                fullUrl = `${baseURL}${url}?api_key=${api_key}&query=${encodeURIComponent(
                  keyword
                )}${params}`;

                fetch(fullUrl, options)
                  .then((res) => res.json())
                  .then((data) => {
                    let third = data.results.filter(
                      (el) => el.media_type !== "person"
                    );
                    setResults(first.concat(second, third));
                  });
              }
            });
        } else {
          setResults(first);
        }

        if (data.results.length === 0) setMessage("No results");
      })
      .then(() => {
        setTimeout(() => {
          setLoading(false);
          if (newList) setUpdating(false);
        }, 500);
        setQuery("");
      })
      .catch((err) => {
        console.error("Multi search error: ", err);
        setLoading(false);
        if (newList) setUpdating(false);
        setQuery("");
      });
  };

  const getMovieDetails = async (movie) => {
    setLoading(true);
    if (newList) setUpdating(true);

    try {
      var newMovie = await getDetails({
        id: movie.id,
        media_type: movie.media_type,
      });

      addMovie(newMovie);
      setLoading(false);
      if (newList) setUpdating(false);
    } catch (err) {
      console.error(
        `Couldn't get details - movie: ${movie.id} - ${JSON.stringify(err)}`
      );
      setLoading(false);
      if (newList) setUpdating(false);
      setMessage("Couldn't fetch the details, please try again.");
    }
  };

  // For dropdown search list
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSearch = () => {
    if (results.length > 0 && query) setResults([]);

    if (query) getResults(query);

    if (!open) handleToggle();
  };

  const handleKeys = (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      handleSearch();
    }

    if (ev.key === "ArrowDown" && open) {
      ev.preventDefault();
      document.getElementById("movie-list").firstChild.focus();
    }

    if (ev.key === "Escape" && open) {
      handleToggle();
    }
  };

  const handleListItemClick = (index) => {
    getMovieDetails(results[index]);
    document.querySelector("input[type='search']").focus();
  };

  return (
    <>
      <TextField
        id={`${listID}-input`}
        name="movies"
        label={matches2 ? "Add movies" : "Add movies / TV shows"}
        type="search"
        variant="outlined"
        autoComplete="off"
        fullWidth
        onChange={updateQuery}
        onKeyDown={handleKeys}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSearch} disabled={loading || addingMovie}>
                {loading || addingMovie ? (
                  <CircularProgress size="1.5rem" thickness={5} />
                ) : (
                  "Search"
                )}
              </Button>
            </InputAdornment>
          ),
        }}
        ref={anchorRef}
        aria-controls={open ? "movie-list" : undefined}
        aria-haspopup="true"
      />
      {results.length > 0 &&
        (matches ? (
          <DropdownModal
            dropdownProps={{
              open,
              setOpen,
              anchorRef,
              handleListItemClick,
            }}
            results={results}
          />
        ) : (
          <Dropdown
            dropdownProps={{
              open,
              setOpen,
              anchorRef,
              handleListItemClick,
            }}
            results={results}
          />
        ))}
      {message && (
        <Snackbar
          open={message.length > 0}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={3000}
          onClose={handleMessage}
        >
          <Alert
            severity="warning"
            variant="filled"
            style={{
              fontSize: "1rem",
              alignItems: "center",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
