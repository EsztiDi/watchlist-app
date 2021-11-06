import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import MovieListItem from "./MovieListItem";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
    height: "80%",
    border: "2px solid #F7C550",
    borderRadius: "4px",
    boxShadow: theme.shadows[5],
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "7px",
      height: "7px",
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
  itemMobile: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
}));

export default function DropdownModal({ dropdownProps, results }) {
  const { open, setOpen, anchorRef, handleListItemClick } = dropdownProps;
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:640px)");

  const handleClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Modal
      aria-describedby="movie-list"
      className={classes.modal}
      ref={anchorRef.current}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper
          id="movie-list"
          style={matches ? { width: "95%" } : { width: "80%" }}
          className={classes.list}
          onClick={handleClose}
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
      </Fade>
    </Modal>
  );
}
