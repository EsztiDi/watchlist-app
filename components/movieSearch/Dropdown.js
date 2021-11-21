import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MovieListItem from "./MovieListItem";

const useStyles = makeStyles((theme) => ({
  dropdown: {
    width: "100%",
    maxHeight: "500px",
    border: "2px solid #F7C550",
    borderRadius: "4px",
    zIndex: "1111",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
      background: "#F0F0F0",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F0F0F0",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#CECECE",
      borderRadius: "100px",
    },
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  itemMobile: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

export default function Dropdown({ dropdownProps, results }) {
  const { open, setOpen, anchorRef, handleListItemClick } = dropdownProps;
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:640px)");

  const handleClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target)) {
      return;
    }
    setOpen(false);
  };

  const handleKeys = (ev) => {
    if (ev.key === "ArrowDown" && open) {
      ev.preventDefault();
      let active = document.activeElement;
      if (active.nextElementSibling.nextElementSibling) {
        active.nextElementSibling.nextElementSibling.focus();
      }
    }

    if (ev.key === "ArrowUp" && open) {
      ev.preventDefault();
      let active = document.activeElement;
      if (active.previousElementSibling) {
        active.previousElementSibling.previousElementSibling.focus();
      }
    }

    if (ev.key === "Enter") {
      setOpen(false);
    }

    if (ev.key === "Escape" && open) {
      setOpen(false);
      document.querySelector("input[type='search']").focus();
    }
  };

  return (
    <Popper
      className={classes.dropdown}
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      disablePortal
      placement="bottom"
    >
      <ClickAwayListener onClickAway={handleClose}>
        <Paper
          id="movie-list"
          className={classes.list}
          onClick={handleClose}
          onKeyDown={handleKeys}
        >
          {results.map((movie, index) => (
            <Fragment key={index}>
              <ListItem
                button
                onClick={() => handleListItemClick(index)}
                className={matches ? classes.itemMobile : undefined}
              >
                <MovieListItem movie={movie} />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
}
