import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAddRoundedIcon from "@material-ui/icons/PlaylistAddRounded";

const ListsMenu = dynamic(() => import("../../carousel/ListsMenu"));

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "1.6rem",
    color: theme.palette.primary.light,
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function AddButton({ movie, updating, setMessage }) {
  const classes = useStyles();

  // For ListsMenu
  const [session, loading] = useSession();
  const router = useRouter();
  const { data: lists, error } = useSWR(session ? "/api/lists" : null);
  const { data: savedLists, error: error2 } = useSWR(
    session ? "/api/lists/saved" : null
  );
  if (error) console.error(error);
  if (error2) console.error(error2);

  const [menuOpen, setMenuOpen] = useState(false);
  const anchorRef = useRef(null);

  useEffect(() => {
    return () => {
      setMenuOpen(false);
    };
  }, [movie?.id]);

  const handleButtonClick = () => {
    if (!loading && !session) {
      router?.push("/login");
    } else if (
      lists &&
      lists.length === 0 &&
      savedLists &&
      savedLists.filter((list) => {
        return list?.uid;
      }).length === 0
    ) {
      setMessage("Create a list first.");
    } else {
      setMenuOpen((prevOpen) => !prevOpen);
    }
  };

  const handleMenuClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleListKeyDown = (ev) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      setMenuOpen(false);
    }
  };

  return (
    <>
      <IconButton
        aria-controls={menuOpen ? "menu-list" : undefined}
        aria-haspopup="true"
        aria-label="add to list"
        title="Add to list"
        ref={anchorRef}
        disabled={updating}
        onClick={handleButtonClick}
        className={classes.button}
      >
        <PlaylistAddRoundedIcon className={classes.icon} />
      </IconButton>
      {session && menuOpen && (
        <ListsMenu
          menuOpen={menuOpen}
          anchorEl={anchorRef.current}
          handleMenuClose={handleMenuClose}
          handleListKeyDown={handleListKeyDown}
          movie={movie}
          setMessage={setMessage}
        />
      )}
    </>
  );
}
