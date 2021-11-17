import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import VerticalAlignTopRoundedIcon from "@material-ui/icons/VerticalAlignTopRounded";
import VerticalAlignBottomRoundedIcon from "@material-ui/icons/VerticalAlignBottomRounded";
import KeyboardArrowUpRoundedIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import AddButton from "./AddButton";

const useStyles = makeStyles((theme) => ({
  buttons: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& svg": {
      fontSize: "1.6rem",
      transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    },
  },
  buttonsMobile: {
    flexBasis: "95%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& svg": {
      fontSize: "1.5rem",
      transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    },
  },
  bigbutton: {
    padding: theme.spacing(0.8),
  },
  button: {
    padding: theme.spacing(0.5),
  },
  delete: {
    color: theme.palette.secondary.light,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  bigarrow: {
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  arrow: {
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function Buttons({
  movie,
  index,
  moviesLength,
  deleteMovie,
  moveMovie,
  updating,
  setMessage,
}) {
  var { position } = movie;

  const classes = useStyles();
  const matches2 = useMediaQuery("(max-width:500px)");

  const handleDelete = async (idx) => {
    deleteMovie(idx);
  };

  return (
    <div className={matches2 ? classes.buttonsMobile : classes.buttons}>
      {matches2 && (
        <IconButton
          aria-label="remove"
          title="Remove"
          className={classes.button}
          disabled={updating}
          onClick={() => handleDelete(index)}
        >
          <HighlightOffRoundedIcon className={classes.delete} />
        </IconButton>
      )}
      {index > 0 && (
        <>
          {index > 1 && (
            <IconButton
              aria-label="move to top"
              title="Move to top"
              className={classes.bigbutton}
              disabled={updating}
              onClick={() => moveMovie("top", index, position)}
            >
              <VerticalAlignTopRoundedIcon
                className={classes.bigarrow}
                style={
                  matches2 ? { fontSize: "1.2rem" } : { fontSize: "1.3rem" }
                }
              />
            </IconButton>
          )}
          <IconButton
            aria-label="move up"
            title="Move up"
            className={classes.button}
            disabled={updating}
            onClick={() => moveMovie("up", index, position)}
          >
            <KeyboardArrowUpRoundedIcon className={classes.arrow} />
          </IconButton>
        </>
      )}
      {!matches2 && (
        <IconButton
          aria-label="remove"
          title="Remove"
          className={classes.button}
          disabled={updating}
          onClick={() => handleDelete(index)}
        >
          <HighlightOffRoundedIcon className={classes.delete} />
        </IconButton>
      )}
      {index < moviesLength - 1 && (
        <>
          <IconButton
            aria-label="move down"
            title="Move down"
            className={classes.button}
            disabled={updating}
            onClick={() => moveMovie("down", index, position)}
          >
            <KeyboardArrowDownRoundedIcon className={classes.arrow} />
          </IconButton>
          {index < moviesLength - 2 && (
            <IconButton
              aria-label="move to bottom"
              title="Move to bottom"
              className={classes.bigbutton}
              disabled={updating}
              onClick={() => moveMovie("bottom", index, position)}
            >
              <VerticalAlignBottomRoundedIcon
                className={classes.bigarrow}
                style={
                  matches2 ? { fontSize: "1.2rem" } : { fontSize: "1.3rem" }
                }
              />
            </IconButton>
          )}
        </>
      )}
      {matches2 && (
        <AddButton movie={movie} updating={updating} setMessage={setMessage} />
      )}
    </div>
  );
}
