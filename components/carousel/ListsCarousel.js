import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import Divider from "@material-ui/core/Divider";
import Skeleton from "@material-ui/lab/Skeleton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Carousel from "react-material-ui-carousel";

import ListCard from "../listCard/ListCard";

const useStyles = makeStyles((theme) => ({
  listsCard: {
    width: "900px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px 0`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& .CarouselItem > div": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
  listsCardMobile: {
    width: "500px",
    minHeight: "410px",
    margin: `${theme.spacing(3)}px 0`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& .CarouselItem > div": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
  listsCardMobile2: {
    width: "100%",
    minHeight: "410px",
    margin: `${theme.spacing(2)}px ${theme.spacing(0.5)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& .CarouselItem > div": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
  header: {
    position: "relative",
    marginBottom: theme.spacing(1),
    "& h4": {
      flexGrow: 1,
    },
  },
  headerFlex: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    // justifyContent: "flex-end",
    columnGap: "16px",
    rowGap: "8px",
    marginBottom: theme.spacing(1),
  },
  search: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: "152px",
    transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "& input": {
      padding: "11px",
      paddingRight: theme.spacing(0),
    },
    "& label": {
      top: "-7px",
    },
  },
  searchMobile: {
    width: "152px",
    transition: "width 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "& input": {
      padding: "11px",
      paddingRight: theme.spacing(0),
    },
    "& label": {
      top: "-7px",
    },
  },
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "1.6rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  divider: {
    marginBottom: theme.spacing(2.5),
  },
  skeletons: {
    display: "flex",
    justifyContent: "space-evenly",
    "& > span": {
      borderRadius: "10px",
    },
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function ListsCarousel({ setMessage }) {
  const classes = useStyles();

  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:520px)");
  const matches3 = useMediaQuery("(min-width:1024px)");
  const matches4 = useMediaQuery("(min-width:520px)");

  var { data: lists, error } = useSWR("/api/lists/public");
  if (error) console.error(error);

  if (lists) {
    var sliced = [];
    for (var i = 0; i < lists.length; i += matches2 ? 1 : matches ? 2 : 4) {
      sliced.push(lists.slice(i, matches2 ? i + 1 : matches ? i + 2 : i + 4));
    }
  }

  // For list search
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [alert, setAlert] = React.useState("");

  if (results.length > 0 && query) {
    sliced = [];
    for (var i = 0; i < results.length; i += matches2 ? 1 : matches ? 2 : 4) {
      sliced.push(results.slice(i, matches2 ? i + 1 : matches ? i + 2 : i + 4));
    }
  }

  React.useEffect(() => {
    loading
      ? window.addEventListener("beforeunload", unloadAlert)
      : window.removeEventListener("beforeunload", unloadAlert);
  }, [loading]);

  const updateQuery = (ev) => {
    setQuery(ev.target.value);
    setAlert("");

    if (query.length === 0) setResults([]);
  };

  const handleFocus = (ev) => {
    ev.target.parentElement.parentElement.style.position = "relative";
    ev.target.parentElement.parentElement.style.width = matches2
      ? "95%"
      : 468 - 16 - 204 + "px";
    var header = document.getElementById("header");
    if (!matches) {
      header.style.display = "flex";
      header.style.flexWrap = "wrap";
      header.style.alignItems = "center";
      header.style.justifyContent = "flex-end";
      header.style.columnGap = "16px";
    }
  };
  const handleBlur = (ev) => {
    ev.target.parentElement.parentElement.style.width = "152px";
    setTimeout(() => {
      ev.target.parentElement.parentElement.style.position = matches
        ? "relative"
        : "absolute";
      // if (!matches) document.getElementById("header").style.display = "block";
    }, 230);
  };

  const handleSearch = async () => {
    if (query) {
      setLoading(true);
      await fetch(`api/lists/search/${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.data?.length === 0) setAlert("No results");
          if (res.data?.length > 0) setResults(res.data);
        })
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setQuery("");
          setLoading(false);
        });
    }
  };

  const handleKeys = (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      handleSearch();
    }
  };
  const handleMessage = () => {
    setMessage("");
  };

  return (
    <Paper
      elevation={1}
      className={
        matches2
          ? classes.listsCardMobile2
          : matches
          ? classes.listsCardMobile
          : classes.listsCard
      }
    >
      <div
        id="header"
        className={matches ? classes.headerFlex : classes.header}
        style={
          matches2
            ? { justifyContent: "center", flexDirection: "column" }
            : { justifyContent: "flex-end" }
        }
      >
        <Typography variant="h4">New watchlists</Typography>
        <TextField
          name="lists"
          label="Search lists"
          type="search"
          variant="outlined"
          autoComplete="off"
          aria-controls="lists-carousel"
          onChange={updateQuery}
          onKeyDown={handleKeys}
          onFocus={handleFocus}
          onBlur={handleBlur}
          classes={{
            root: matches ? classes.searchMobile : classes.search,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="search lists"
                  disabled={loading}
                  onClick={handleSearch}
                  className={classes.button}
                >
                  {loading ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    <SearchRoundedIcon className={classes.icon} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {alert && (
          <Snackbar
            open={alert.length > 0}
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
              {alert}
            </Alert>
          </Snackbar>
        )}
      </div>
      <Divider className={classes.divider} />
      {!lists ? (
        <span className={classes.skeletons}>
          <Skeleton variant="rect" width={200} height={300} />
          {matches4 && <Skeleton variant="rect" width={200} height={300} />}
          {matches3 && <Skeleton variant="rect" width={200} height={300} />}
          {matches3 && <Skeleton variant="rect" width={200} height={300} />}
        </span>
      ) : lists.length === 0 ? (
        <Typography variant="h6">No public watchlists to show</Typography>
      ) : (
        <Carousel
          id="lists-carousel"
          className={classes.carousel}
          autoPlay={false}
          interval={5000}
          timeout={300}
          navButtonsProps={{
            style: {
              margin: 0,
            },
          }}
          indicatorContainerProps={{
            style: {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            },
          }}
        >
          {sliced.map((page) => {
            return page.map((list, index) => {
              return (
                <ListCard
                  key={index}
                  list={list}
                  index={index}
                  setMessage={setMessage}
                />
              );
            });
          })}
        </Carousel>
      )}
    </Paper>
  );
}
