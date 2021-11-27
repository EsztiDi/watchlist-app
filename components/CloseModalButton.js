import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

const useStyles = makeStyles((theme) => ({
  close: {
    position: "absolute",
    top: 0,
    right: 0,
    transform: "translateY(-110%)",
    color: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    "& svg": {
      fontSize: "1.7rem",
    },
  },
}));

export default function CloseModalButton({ onClose }) {
  const classes = useStyles();

  return (
    <IconButton
      aria-label="close modal"
      title="Close"
      onClick={onClose}
      className={classes.close}
    >
      <HighlightOffRoundedIcon />
    </IconButton>
  );
}
