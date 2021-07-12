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

export default function ListsMenu({
  movieID,
  media_type,
  userLists,
  setMessage,
}) {
  const classes = useStyles();
  const contentType = "application/json";
  const [updating, setUpdating] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data: lists, error: error2 } = useSWR("/api/lists", {
    initialData: userLists,
  });

  const add = async (id, idx) => {
    setUpdating(true);
    setValue(idx);

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

      mutate("/api/lists");
      mutate(`/api/lists/${id}`);

      const { success } = await res.json();
      if (success) setAdded(true);

      setUpdating(false);
    } catch (error) {
      setMessage(error.message + " - Failed to add, please try again.");
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
          {added && index === value && " ✔"}
        </Typography>
      </MenuItem>
    );
  });
}
