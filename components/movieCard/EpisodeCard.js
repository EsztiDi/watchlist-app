import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

import Overview from "./Overview";

const useStyles = makeStyles((theme) => ({
  episodecard: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    minWidth: "70%",
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  image: {
    minWidth: "20%",
    paddingTop: "11.3%",
    backgroundSize: "contain",
  },
  date: {
    marginBottom: theme.spacing(1),
    fontSize: "0.95rem",
    whiteSpace: "nowrap",
  },
}));

export default function EpisodeCard({ episode }) {
  const classes = useStyles();

  var { episode_number, air_date, name, overview, still_path } = episode;

  var image = still_path
    ? `https://image.tmdb.org/t/p/w200${still_path}`
    : "/movieIcon.png";

  air_date = air_date
    ? new Date(air_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No release date";

  return (
    <>
      <Card className={classes.episodecard}>
        <CardMedia className={classes.image} image={image} />
        <CardContent className={classes.content}>
          <Typography component="h6" variant="h6">
            {episode_number ? `Ep.${episode_number} – ` : ""}
            {name ? name : "Untitled"}
          </Typography>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            className={classes.date}
          >
            {air_date}
          </Typography>
          <Overview overview={overview} />
        </CardContent>
      </Card>
    </>
  );
}
