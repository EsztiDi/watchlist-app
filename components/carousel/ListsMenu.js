import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  menuItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  added: {
    width: "100%",
    textAlign: "center",
    color: "#009688",
    // color: "#00695f",
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function ListsMenu({
  movieID,
  media_type,
  userLists,
  setMessage,
  session,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  const [updating, setUpdating] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [value, setValue] = React.useState("");
  const isMounted = React.useRef(null);

  const { data: lists, error } = useSWR(session ? "/api/lists" : null, {
    refreshInterval: 1000,
    initialData: userLists,
  });

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const add = async (id, idx) => {
    setUpdating(true);
    setValue(idx);
    window.addEventListener("beforeunload", unloadAlert);

    try {
      const res = await fetch(`/api/lists/add/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ id: movieID, media_type }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }
      const { success, data } = await res.json();

      window.removeEventListener("beforeunload", unloadAlert);

      await mutate(`/api/lists/${id}`, data);
      await mutate("/api/lists");

      if (isMounted.current && success) setAdded(true);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      window.removeEventListener("beforeunload", unloadAlert);
      setMessage(error.message + " - Failed to update, please try again.");
      setUpdating(false);
    }
  };

  return lists.map((list, index) => {
    return (
      <MenuItem
        key={index}
        disabled={updating}
        onClick={() => add(list._id, index)}
      >
        <Typography
          variant="button"
          className={
            list?.movies?.map((mov) => mov.id).includes(movieID)
              ? classes.added
              : classes.menuItem
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
  });
}