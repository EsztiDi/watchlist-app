import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";

import SavedListItem from "./SavedListItem";

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
  const router = useRouter();
  const contentType = "application/json";
  movieID = movieID ? movieID : movie.id;

  const [updating, setUpdating] = useState(false);
  const [added, setAdded] = useState(false);
  const [value, setValue] = useState("");
  const isMounted = useRef(null);

  const [session] = useSession();
  const { data: lists, error } = useSWR(session ? "/api/lists" : null);
  const { data: savedLists, error: error2 } = useSWR(
    session ? "/api/lists/saved" : null
  );
  if (error) console.error("lists - " + error);
  if (error2) console.error("savedLists - " + error2);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const beforeRouteHandler = (url) => {
      if (
        router?.pathname !== url &&
        !confirm("Changes that you made may not be saved.")
      ) {
        router?.events?.emit("routeChangeError");
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    if (updating) {
      window.addEventListener("beforeunload", unloadAlert);
      router?.events?.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    };
    // eslint-disable-next-line
  }, [updating]);

  const add = async (id, idx) => {
    setUpdating(true);
    setValue(idx);

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

      await mutate(`/api/lists/${id}`);
      await mutate("/api/lists");

      if (isMounted.current && success) setAdded(true);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      setMessage(`${error.message} - Failed to update, please try again.`);
      setUpdating(false);
    }
  };

  if (!lists || !savedLists) return null;

  return (
    <Popper
      open={menuOpen}
      anchorEl={anchorEl}
      role={undefined}
      transition
      style={{ zIndex: 9999 }}
    >
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
                        key={list._id}
                        disabled={updating}
                        onClick={() => add(list._id, index)}
                        className={classes.item}
                      >
                        <Typography
                          variant="button"
                          className={
                            list?.movies
                              ?.map((mov) => mov.id)
                              ?.includes(movieID)
                              ? classes.added
                              : classes.text
                          }
                        >
                          {list.title}
                          {index === value &&
                            list?.movies
                              ?.map((mov) => mov.id)
                              ?.includes(movieID) &&
                            added &&
                            " ✔"}
                        </Typography>
                      </MenuItem>
                    );
                  })}
                {savedLists &&
                  savedLists
                    .filter((list) => {
                      return list?.uid;
                    })
                    .map((list, index) => {
                      return (
                        <SavedListItem
                          key={list?.listid}
                          movieID={movieID}
                          listID={list?.listid}
                          index={index + lists?.length}
                          value={value}
                          updating={updating}
                          add={add}
                          added={added}
                        />
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
