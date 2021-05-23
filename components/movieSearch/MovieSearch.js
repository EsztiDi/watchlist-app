import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import Dropdown from "./Dropdown";

export default function MovieSearch(props) {
  const { listId, addMovie } = props;

  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [message, setMessage] = React.useState("");

  const handleMessage = () => {
    setMessage("");
  };

  const updateQuery = (ev) => {
    setQuery(ev.target.value);
    setMessage("");
  };

  const getResults = (keyword) => {
    setLoading(true);

    var baseURL = "https://api.themoviedb.org/3/";
    var url = "search/multi/";
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
        }, 500);
        setQuery("");
      })
      .catch((err) => {
        console.error("Multi search error: ", err);
        setLoading(false);
        setQuery("");
      });
  };

  const getDetails = (movie) => {
    setLoading(true);

    var baseURL = "https://api.themoviedb.org/3/";
    var url = `/${movie.media_type}/${movie.id}`;
    var api_key = process.env.TMDB_API_KEY;
    var params = "&append_to_response=credits,external_ids&include_adult=false";
    var fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;
    var options = {
      headers: {
        Authorization: process.env.TMDB_BEARER,
        "Content-Type": "application/json;charset=utf-8",
      },
    };

    fetch(fullUrl, options)
      .then((res) => res.json())
      .then(async (data) => {
        var newMovie =
          movie.media_type === "tv"
            ? {
                id: movie.id,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                title: movie.name,
                release_date: movie.first_air_date,
                media_type: movie.media_type,
                overview: movie.overview,
                details: {
                  genres: data.genres,
                  runtime: data.runtime,
                  episode_run_time: data.episode_run_time,
                  next_episode_to_air: data.next_episode_to_air,
                  last_episode_to_air: data.last_episode_to_air,
                  last_air_date: data.last_air_date,
                  number_of_episodes: data.number_of_episodes,
                  created_by: data.created_by,
                  credits: data.credits,
                  vote_average: data.vote_average,
                  external_ids: data.external_ids,
                },
              }
            : {
                id: movie.id,
                poster_path: movie.poster_path,
                backdrop_path: movie.backdrop_path,
                title: movie.title,
                release_date: movie.release_date,
                media_type: movie.media_type,
                overview: movie.overview,
                details: {
                  genres: data.genres,
                  runtime: data.runtime,
                  credits: data.credits,
                  vote_average: data.vote_average,
                  external_ids: data.external_ids,
                },
              };

        if (movie.media_type === "tv" && data.number_of_seasons) {
          var seasons = [];

          for (let season = 1; season <= data.number_of_seasons; season++) {
            url = `/tv/${movie.id}/season/${season}`;
            params = "";
            fullUrl = `${baseURL}${url}?api_key=${api_key}${params}`;

            await fetch(fullUrl, options)
              .then((res) => res.json())
              .then((data) => {
                seasons.push(data);
              })
              .catch((err) => {
                console.error("Season details error: ", err);
                (!data || data.length === 0) &&
                  setMessage("Couldn't get details, please try again.");
              });
          }

          addMovie({ ...newMovie, seasons }, listId);
          setLoading(false);
        } else {
          addMovie(newMovie, listId);
          setLoading(false);
        }

        if (!data || data.length === 0)
          setMessage("Couldn't get details, please try again.");
      })
      .catch((err) => {
        var newMovie = {
          id: movie.id,
          poster_path: movie.poster_path,
          title: movie.title || movie.name,
          release_date: movie.release_date || movie.first_air_date,
          media_type: movie.media_type,
          overview: movie.overview,
          details: {},
        };
        console.error("Movie details error: ", err);
        addMovie(newMovie, listId);
        setMessage("Couldn't get details, please try again.");
        setLoading(false);
      });
  };

  // For dropdown search list
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const prevOpen = React.useRef(open);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  React.useEffect(() => {
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
    getDetails(results[index]);
  };

  return (
    <>
      <TextField
        name="movies"
        label="Add movies / TV shows"
        type="search"
        variant="outlined"
        // autoComplete="off"
        fullWidth
        onChange={updateQuery}
        onKeyDown={handleKeys}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={handleSearch}>
                {loading ? (
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
      {results.length > 0 && (
        <Dropdown
          dropdownProps={{
            open,
            setOpen,
            anchorRef,
            handleToggle,
            handleListItemClick,
          }}
          results={results}
        />
      )}
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
            style={{ fontSize: "1.2rem", alignItems: "center" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
