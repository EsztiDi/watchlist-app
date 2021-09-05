import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
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
  title: {
    marginBottom: theme.spacing(1),
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
  var [updating, setUpdating] = React.useState(false);
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:520px)");
  const matches3 = useMediaQuery("(min-width:1024px)");
  const matches4 = useMediaQuery("(min-width:520px)");

  const { data: lists, error } = useSWR("/api/lists/public");
  if (error) console.error(error);

  if (lists) {
    var sliced = [];
    for (var i = 0; i < lists.length; i += matches2 ? 1 : matches ? 2 : 4) {
      sliced.push(lists.slice(i, matches2 ? i + 1 : matches ? i + 2 : i + 4));
    }
  }

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
      <Typography variant="h4" className={classes.title}>
        New Watchlists
      </Typography>
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
          className={classes.carousel}
          autoPlay={false}
          interval={5000}
          timeout={300}
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
                  updating={updating}
                  setUpdating={setUpdating}
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
