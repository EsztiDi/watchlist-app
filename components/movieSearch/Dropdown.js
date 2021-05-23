import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

import MovieListItem from "./MovieListItem";

const useStyles = makeStyles((theme) => ({
  dropdown: {
    width: "100%",
    maxHeight: "430px",
    border: "2px solid #F7C550",
    borderRadius: "4px",
    zIndex: "99",
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
    paddingBottom: 0,
  },
}));

export default function Dropdown({ dropdownProps, results }) {
  const classes = useStyles();
  const { open, setOpen, anchorRef, handleToggle, handleListItemClick } =
    dropdownProps;

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
      handleToggle();
    }

    if (ev.key === "Escape" && open) {
      handleToggle();
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
    >
      <Paper>
        <ClickAwayListener onClickAway={handleClose}>
          <List
            id="movie-list"
            className={classes.list}
            onClick={handleClose}
            onKeyDown={handleKeys}
          >
            {results.map((movie, index) => (
              <React.Fragment key={index}>
                <ListItem
                  // key={index + "-L"}
                  button
                  onClick={() => handleListItemClick(index)}
                >
                  <MovieListItem movie={movie} />
                </ListItem>
                <Divider
                // key={index + "-D"}
                />
              </React.Fragment>
            ))}
          </List>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
}
