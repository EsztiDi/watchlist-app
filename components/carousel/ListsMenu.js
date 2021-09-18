import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
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

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function ListsMenu({
  movie,
  movieID,
  media_type,
  setMessage,
  handleMenuClose,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  movieID = movieID ? movieID : movie.id;
  const [updating, setUpdating] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isMounted = React.useRef(null);

  const { data: lists, error } = useSWR("/api/lists");
  if (error) console.error(error);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const add = async (id, idx, ev) => {
    setUpdating(true);
    setValue(idx);
    window.addEventListener("beforeunload", unloadAlert);

    try {
      const res = await fetch(`/api/lists/add/${id}`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(movie ? movie : { id: movieID, media_type }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const { success } = await res.json();

      window.removeEventListener("beforeunload", unloadAlert);

      await mutate(`/api/lists/${id}`);
      await mutate("/api/lists");

      if (isMounted.current && success) setAdded(true);
      if (isMounted.current) setUpdating(false);
      if (handleMenuClose && isMounted.current) {
        setTimeout(() => {
          handleMenuClose(ev);
        }, 150);
      }
    } catch (error) {
      window.removeEventListener("beforeunload", unloadAlert);
      setMessage(
        `${JSON.stringify(error.message)} - Failed to update, please try again.`
      );
      setUpdating(false);
    }
  };

  if (!lists) return null;

  return (
    lists &&
    lists.map((list, index) => {
      return (
        <MenuItem
          key={index}
          disabled={updating}
          onClick={(ev) => add(list._id, index, ev)}
          className={classes.item}
        >
          <Typography
            variant="button"
            className={
              list?.movies?.map((mov) => mov.id).includes(movieID)
                ? classes.added
                : classes.text
            }
          >
            {list.title}
            {index === value &&
              list?.movies?.map((mov) => mov.id).includes(movieID) &&
              added &&
              " ✔"}
          </Typography>
        </MenuItem>
      );
    })
  );
}
