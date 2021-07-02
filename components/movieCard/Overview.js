import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  overview: {
    fontSize: "0.95rem",
    maxHeight: "46px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#CECECE",
      borderRadius: "100px",
    },
  },
}));

export default function Overview({ overview, height }) {
  const classes = useStyles();

  return (
    <Typography
      className={classes.overview}
      style={height ? { maxHeight: height, margin: "0.5rem 0" } : undefined}
    >
      {overview || ""}
    </Typography>
  );
}
