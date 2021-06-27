import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  image: {
    minWidth: "14%",
    paddingTop: "21%",
    backgroundSize: "contain",
  },
  content: {
    minWidth: "70%",
    padding: `0 ${theme.spacing(1.5)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  overview: {
    fontSize: "0.95rem",
    maxHeight: "90.56px",
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

export default function MovieListItem({ movie }) {
  const classes = useStyles();

  var {
    poster_path,
    title,
    name,
    release_date,
    first_air_date,
    media_type,
    overview,
  } = movie;

  var poster = poster_path
    ? `https://image.tmdb.org/t/p/w200${poster_path}`
    : "/movieIcon.png";

  title = title || name || "Untitled";

  var year = release_date
    ? new Date(release_date).getFullYear()
    : first_air_date
    ? new Date(first_air_date).getFullYear()
    : "No release date";

  return (
    <>
      <CardMedia className={classes.image} image={poster} />
      <CardContent className={classes.content}>
        <Typography component="h6" variant="h6" className={classes.title}>
          {title} ({year}, {media_type || "-"})
        </Typography>
        <Typography className={classes.overview}>{overview || ""}</Typography>
      </CardContent>
    </>
  );
}
