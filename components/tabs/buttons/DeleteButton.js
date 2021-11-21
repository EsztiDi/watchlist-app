import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

const useStyles = makeStyles((theme) => ({
  delete: {
    fontSize: "1.7rem",
    color: theme.palette.secondary.light,
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

export default function DeleteButton({
  auth,
  updating,
  handleOpenDelete,
  classes,
}) {
  const classes2 = useStyles();

  return (
    <IconButton
      aria-label="delete watchlist"
      title={auth ? "Delete" : "Remove"}
      disabled={updating}
      onClick={handleOpenDelete}
      className={classes.button}
    >
      <HighlightOffRoundedIcon className={classes2.delete} />
    </IconButton>
  );
}
