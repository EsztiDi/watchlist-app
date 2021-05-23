import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  image: {
    minWidth: "20%",
    paddingTop: "30%",
    backgroundSize: "contain",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    minWidth: "70%",
  },
  content: {
    flex: "1 0 auto",
  },
  overview: {
    textAlign: "left",
    fontSize: "0.95rem",
    maxHeight: "113.2px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "6px",
      height: "6px",
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
}));

export default function MovieListItem({ movie }) {
  const classes = useStyles();

  let {
    poster_path,
    title,
    name,
    release_date,
    first_air_date,
    media_type,
    overview,
  } = movie;

  title = title || name || "Untitled";
  release_date = release_date
    ? new Date(release_date).getFullYear()
    : first_air_date
    ? new Date(first_air_date).getFullYear()
    : "No release date";

  return (
    <React.Fragment>
      <CardMedia
        className={classes.image}
        image={
          poster_path
            ? `https://image.tmdb.org/t/p/w200${poster_path}`
            : "/movieIcon.png"
        }
      />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h6" variant="h6" className={classes.title}>
            {title} ({release_date}, {media_type ? media_type : "-"})
          </Typography>
          <Typography className={classes.overview}>
            {overview ? overview : ""}
          </Typography>
        </CardContent>
      </div>
    </React.Fragment>
  );
}
