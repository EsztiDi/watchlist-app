import { makeStyles } from "@material-ui/core/styles";
// import Slide from "@material-ui/core/Slide";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  details: {
    borderRadius: "10px",
    width: "200px",
    height: "300px",
    position: "absolute",
    top: 0,
    background: "rgba(0,0,0,0.5)",
    opacity: 0,
    transition: "0.2s",
    "&:hover": {
      opacity: 1,
    },
  },
}));

export default function MovieDetails({ left, movie }) {
  const classes = useStyles();

  return (
    <div
      className={classes.details}
      style={left ? { left: "26px" } : { right: "26px" }}
    ></div>
  );
}
