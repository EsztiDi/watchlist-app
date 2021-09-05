import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(0.5),
  },
  titleMobile: {
    display: "flex",
    alignItems: "center",
  },
  image: {
    minWidth: "10%",
    paddingTop: "15%",
    backgroundSize: "contain",
  },
  imageMobile: {
    minWidth: "15%",
    paddingTop: "22.5%",
    backgroundSize: "contain",
  },
  content: {
    minWidth: "70%",
    padding: `0 ${theme.spacing(1.5)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  contentMobile: {
    minWidth: "70%",
    padding: `0 ${theme.spacing(0.5)}px`,
    "&:last-child": {
      paddingBottom: 0,
    },
  },
  overview: {
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
  const matches = useMediaQuery("(max-width:768px)");
  const matches2 = useMediaQuery("(max-width:500px)");

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
      <CardMedia
        className={matches2 ? classes.imageMobile : classes.image}
        image={poster}
      />
      <CardContent
        className={matches2 ? classes.contentMobile : classes.content}
      >
        <Typography
          variant="h6"
          className={matches2 ? classes.titleMobile : classes.title}
          style={
            matches2
              ? { fontSize: "0.8rem" }
              : matches
              ? { fontSize: "1rem" }
              : { fontSize: "1.25rem" }
          }
        >
          {!matches2 && `${title} (${year}, ${media_type || "-"})`}
          {matches2 && (
            <span>
              {title}
              <br />({year}, {media_type || "-"})
            </span>
          )}
        </Typography>
        <Typography
          className={classes.overview}
          style={
            matches2
              ? { fontSize: "0.7rem", maxHeight: "33px" }
              : matches
              ? { fontSize: "0.8rem", maxHeight: "38px" }
              : { fontSize: "0.95rem", maxHeight: "68px" }
          }
        >
          {overview || ""}
        </Typography>
      </CardContent>
    </>
  );
}
