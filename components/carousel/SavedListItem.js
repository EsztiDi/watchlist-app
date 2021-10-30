import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  empty: {
    textAlign: "center",
    paddingTop: theme.spacing(0.75),
  },
  item: {
    whiteSpace: "unset",
    textAlign: "center",
  },
  text: {
    width: "100%",
  },
  added: {
    width: "100%",
    color: "#009688",
  },
}));

export default function SavedListItem({
  movieID,
  listID,
  index,
  value,
  updating,
  add,
  added,
}) {
  const classes = useStyles();

  var { data: savedList, error } = useSWR(
    listID ? `/api/lists/${listID}` : null
  );
  if (error) console.error(error);

  return !savedList ? (
    <div className={classes.empty}>
      <CircularProgress size="1.5rem" thickness={5} />
    </div>
  ) : (
    <MenuItem
      disabled={updating}
      onClick={() => add(listID, index)}
      className={classes.item}
    >
      <Typography
        variant="button"
        className={
          savedList?.movies?.map((mov) => mov.id)?.includes(movieID)
            ? classes.added
            : classes.text
        }
      >
        {savedList?.title}
        {index === value &&
          savedList?.movies?.map((mov) => mov.id)?.includes(movieID) &&
          added &&
          " ✔"}
      </Typography>
    </MenuItem>
  );
}
