import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
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
  menuOpen,
  anchorEl,
  handleMenuClose,
  handleListKeyDown,
  movie,
  movieID,
  media_type,
  locale,
  setMessage,
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

  const add = async (id, idx) => {
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
        body: JSON.stringify(
          movie ? movie : { id: movieID, media_type, locale }
        ),
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
    } catch (error) {
      window.removeEventListener("beforeunload", unloadAlert);
      setMessage(`${error.message} - Failed to update, please try again.`);
      setUpdating(false);
    }
  };

  if (!lists) return null;

  return (
    <Popper open={menuOpen} anchorEl={anchorEl} role={undefined} transition>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom",
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleMenuClose}>
              <MenuList
                autoFocus={menuOpen}
                id="menu-list"
                onKeyDown={handleListKeyDown}
              >
                {lists &&
                  lists.map((list, index) => {
                    return (
                      <MenuItem
                        key={index}
                        disabled={updating}
                        onClick={() => add(list._id, index)}
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
                            list?.movies
                              ?.map((mov) => mov.id)
                              .includes(movieID) &&
                            added &&
                            " ✔"}
                        </Typography>
                      </MenuItem>
                    );
                  })}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}
