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
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(1),
    "& > h4": {
      gridArea: "1 / 2 / 2 / 3",
    },
    "& > div": {
      width: "155px",
      gridArea: "1 / 3 / 2 / 4",
      justifySelf: "end",
      "&:focus-within": {
        width: 468 - 16 - 204 + "px",
      },
    },
  },
  header2: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(1),
    "& > h4": {
      gridArea: "1 / 1 / 2 / 2",
      justifySelf: "end",
    },
    "& > div": {
      width: "155px",
      gridArea: "1 / 2 / 2 / 3",
      justifySelf: "end",
      "&:focus-within": {
        width: 468 - 16 - 204 + "px",
      },
    },
  },
  header3: {
    display: "grid",
    gap: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(1),
    "& > div": {
      width: "175px",
      justifySelf: "center",
      "&:focus-within": {
        width: "98%",
      },
    },
  },
  search: {
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

  const updateQuery = (ev) => {
    setQuery(ev.target.value);
    setAlert("");

    if (query.length === 0) setResults([]);
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
    setAlert("");
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
        className={
          matches2
            ? classes.header3
            : matches
            ? classes.header2
            : classes.header
        }
      >
        <Typography variant="h4">New watchlists</Typography>
        <TextField
          name="lists"
          label="Search lists"
          type="search"
          variant="outlined"
          autoComplete="off"
          aria-controls={lists?.length > 0 ? "lists-carousel" : undefined}
          onChange={updateQuery}
          onKeyDown={handleKeys}
          classes={{
            root: classes.search,
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
      </div>
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
