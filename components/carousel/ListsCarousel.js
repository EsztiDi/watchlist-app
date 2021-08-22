import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Carousel from "react-material-ui-carousel";

import ListCard from "../listCard/ListCard";

const useStyles = makeStyles((theme) => ({
  listsCard: {
    minWidth: "900px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& > :first-child": {
      marginBottom: theme.spacing(1),
    },
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(2.5),
    },
    "& .CarouselItem > div": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
}));

export default function ListsCarousel({ setMessage }) {
  const classes = useStyles();
  var [updating, setUpdating] = React.useState(false);

  const { data: lists, error } = useSWR("/api/lists/public");
  if (error) console.error(error);

  if (lists) {
    var sliced = [];
    for (var i = 0; i < lists.length; i += 4) {
      sliced.push(lists.slice(i, i + 4));
    }
  }

  return (
    <Paper elevation={1} className={classes.listsCard}>
      <Typography variant="h4">New Watchlists</Typography>
      <Divider />
      {!lists ? (
        <CircularProgress size="3rem" thickness={3} />
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
