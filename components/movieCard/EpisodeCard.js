import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Overview from "./Overview";

const useStyles = makeStyles((theme) => ({
  episodecard: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1.5),
    padding: theme.spacing(1.5),
  },
  episodecardMobile: {
    margin: theme.spacing(0),
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(0.75),
  },
  content: {
    display: "flex",
    flexDirection: "column",
    minWidth: "70%",
    "&:last-child": {
      paddingBottom: theme.spacing(2),
    },
  },
  contentMobile: {
    textAlign: "center",
    padding: theme.spacing(1),
    "&:last-child": {
      paddingBottom: theme.spacing(1),
    },
  },
  image: {
    minWidth: "20%",
    paddingTop: "11.3%",
    backgroundSize: "contain",
  },
  imageMobile: {
    minWidth: "30%",
    paddingTop: "16.95%",
    backgroundSize: "contain",
  },
  imageMobile2: {
    minWidth: "60%",
    paddingTop: "33.9%",
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
  const matches = useMediaQuery("(max-width:768px)");
  const matches2 = useMediaQuery("(max-width:500px)");

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
      <Card
        className={matches2 ? classes.episodecardMobile : classes.episodecard}
      >
        <CardMedia
          className={
            !matches
              ? classes.image
              : !matches2
              ? classes.imageMobile
              : classes.imageMobile2
          }
          image={image}
        />
        <CardContent
          className={matches2 ? classes.contentMobile : classes.content}
        >
          <Typography
            variant="h6"
            style={matches2 ? { fontSize: "1.15rem" } : { fontSize: "1.25rem" }}
          >
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
