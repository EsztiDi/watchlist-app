import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  episodecard: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  details: {
    display: "flex",
    flexDirection: "column",
    minWidth: "70%",
  },
  content: {
    flex: "1 0 auto",
  },
  image: {
    minWidth: "20%",
    paddingTop: "11.3%",
    backgroundSize: "contain",
  },
  info: {
    marginBottom: theme.spacing(1),
    fontSize: "0.95rem",
  },
  date: {
    whiteSpace: "nowrap",
  },
  overview: {
    fontSize: "0.95rem",
    maxHeight: "68px",
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

export default function EpisodeCard({ episode }) {
  const classes = useStyles();

  var { episode_number, air_date, name, overview, still_path } = episode;

  air_date = air_date
    ? new Date(air_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No release date";

  return (
    <React.Fragment>
      <Card className={classes.episodecard}>
        <CardMedia
          data-image="background"
          className={classes.image}
          image={
            still_path
              ? `https://image.tmdb.org/t/p/w200${still_path}`
              : "/movieIcon.png"
          }
        />
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h6" variant="h6">
              {episode_number ? `Ep.${episode_number} – ` : ""}
              {name ? name : "Untitled"}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              className={classes.info}
            >
              {air_date}
            </Typography>
            <Typography className={classes.overview}>
              {overview ? overview : ""}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </React.Fragment>
  );
}
