import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  addmovie: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #FFF",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
  },
  button: {
    padding: theme.spacing(0.5),
  },
  topIcon: {
    fontSize: "1.7rem",
    color: theme.palette.primary.light,
    transition: "color, transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  search: {
    position: "relative",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px 0`,
  },
  searchMobile: {
    position: "relative",
    margin: `${theme.spacing(4)}px 0 0`,
  },
}));

export default function AddMovie({ openSearch, handleOpenSearch }) {
  const classes = useStyles();

  return (
    <IconButton
      id="add"
      aria-label="add movie"
      title="Add movie"
      // component="div"
      onClick={handleOpenSearch}
      className={classes.button}
    >
      {openSearch ? (
        <AddCircleRoundedIcon
          className={classes.topIcon}
          style={{ transform: "rotate(45deg)" }}
        />
      ) : (
        <AddCircleOutlineRoundedIcon className={classes.topIcon} />
      )}
    </IconButton>
  );
}
