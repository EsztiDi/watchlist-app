import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  overview: {
    overflowWrap: "anywhere",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(0.5),
    "& *": {
      fontSize: "0.9rem",
    },
  },
  overviewMobile: {
    overflowWrap: "anywhere",
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(1),
    "& *": {
      fontSize: "0.8rem",
    },
  },
  summary: {
    width: "fit-content",
    cursor: "pointer",
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.text.secondary,
    },
  },
}));

export default function Overview({
  overview,
  movieCard = false,
  carousel = false,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:500px)");

  return (
    overview && (
      <details
        className={
          matches && movieCard ? classes.overviewMobile : classes.overview
        }
      >
        <summary
          style={
            (!movieCard && matches) || carousel ? { margin: "auto" } : undefined
          }
          className={classes.summary}
        >
          Synopsis
        </summary>
        <Typography>{overview}</Typography>
      </details>
    )
  );
}
