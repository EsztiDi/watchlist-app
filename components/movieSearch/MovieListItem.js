import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  titleMobile: {
    fontSize: "1.15rem",
    marginBottom: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
  },
  image: {
    minWidth: "14%",
    paddingTop: "21%",
    backgroundSize: "contain",
  },
  imageMobile: {
    minWidth: "20%",
    paddingTop: "30%",
    backgroundSize: "contain",
    marginRight: theme.spacing(0.5),
  },
  content: {
    minWidth: "70%",
    padding: `0 ${theme.spacing(1.5)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  contentMobile: {
    width: "100%",
    padding: `0 ${theme.spacing(0.75)}px`,
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
  const matches = useMediaQuery("(max-width:640px)");

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
      {!matches && <CardMedia className={classes.image} image={poster} />}
      <CardContent
        className={matches ? classes.contentMobile : classes.content}
      >
        <Typography
          variant="h6"
          className={matches ? classes.titleMobile : classes.title}
        >
          {matches && (
            <CardMedia className={classes.imageMobile} image={poster} />
          )}
          {!matches && `${title} (${year}, ${media_type || "-"})`}
          {matches && (
            <span>
              {title}
              <br />({year}, {media_type || "-"})
            </span>
          )}
        </Typography>
        <Typography className={classes.overview}>{overview || ""}</Typography>
      </CardContent>
    </>
  );
}
