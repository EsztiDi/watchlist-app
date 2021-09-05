import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  overview: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    "& *": {
      fontSize: "0.95rem",
    },
  },
  overviewMobile: {
    marginTop: theme.spacing(0.5),
    "& *": {
      fontSize: "0.8rem",
    },
  },
}));

export default function Overview({ overview, movieCard = false }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:500px)");

  return (
    overview && (
      <details
        className={
          matches && movieCard ? classes.overviewMobile : classes.overview
        }
      >
        <summary>Synopsis</summary>
        <Typography>{overview}</Typography>
      </details>
    )
  );
}
