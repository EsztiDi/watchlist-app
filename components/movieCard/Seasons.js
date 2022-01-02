import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import WatchedButton from "./buttons/WatchedButton";
import EpisodeCard from "./EpisodeCard";
import CloseModalButton from "../CloseModalButton";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  seasons: {
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #FFF",
    borderRadius: "4px",
    boxShadow: theme.shadows[5],
    height: "80%",
  },
  tabheader: {
    position: "fixed",
    width: "inherit",
    background: theme.palette.primary.light,
  },
  episodes: {
    height: "100%",
    overflow: "auto",
    scrollbarWidth: "thin",
    "&::-webkit-scrollbar": {
      width: "7px",
      height: "7px",
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
  tabpanel: {
    marginTop: "48px",
  },
  activeTabpanel: {
    position: "relative",
    "& > button": {
      top: "5px",
      right: "10px",
      "& svg": {
        fontSize: "1.5rem",
      },
    },
  },
  activeTabpanelMobile: {
    "& > button": {
      position: "relative",
      left: "100%",
      transform: "translateX(-100%)",
      "& svg": {
        fontSize: "1.5rem",
      },
    },
    "& > div:first-of-type": {
      marginTop: theme.spacing(0.75),
    },
  },
  none: {
    width: "100%",
    textAlign: "center",
    marginTop: "8px",
  },
}));

function a11yProps(index) {
  return {
    id: `season-tab-${index}`,
    "aria-controls": `season-tabpanel-${index}`,
  };
}

export default function Seasons({
  open,
  onClose,
  seasons,
  lastSeason,
  movieID,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");

  const [seasonTab, setSeasonTab] = useState(lastSeason ? lastSeason - 1 : 0);

  useEffect(() => {
    setSeasonTab(lastSeason ? lastSeason - 1 : 0);
  }, [open, lastSeason]);

  const handleChange = (event, newValue) => {
    setSeasonTab(newValue);

    document.getElementById("modal-description").scrollTop = 0;
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div
          id="seasons"
          style={matches ? { width: "95%" } : { width: "70%" }}
          className={classes.seasons}
        >
          <CloseModalButton onClose={onClose} />
          <AppBar position="static" className={classes.tabheader}>
            <Tabs
              id="modal-title"
              variant="scrollable"
              indicatorColor="secondary"
              value={seasonTab}
              onChange={handleChange}
              aria-label="season tabs"
            >
              {seasons && seasons.length > 0 ? (
                seasons
                  .sort((a, b) => a.season_number - b.season_number)
                  .map((season, index) => (
                    <Tab
                      key={index}
                      label={`Season ${
                        season.season_number
                          ? season.season_number
                          : lastSeason - 1 || ""
                      }`}
                      disableFocusRipple
                      {...a11yProps(index)}
                    />
                  ))
              ) : (
                <Typography variant="h6" className={classes.none}>
                  No episodes found
                </Typography>
              )}
            </Tabs>
          </AppBar>
          <div id="modal-description" className={classes.episodes}>
            {seasons &&
              seasons.length > 0 &&
              seasons
                .sort((a, b) => a.season_number - b.season_number)
                .map((season, index) => (
                  <TabPanel
                    key={index}
                    movieID={movieID}
                    season_number={season.season_number}
                    watched={season.watched}
                    seasonTab={seasonTab}
                    index={index}
                    className={classes.tabpanel}
                  >
                    {season.episodes &&
                      season.episodes.length > 0 &&
                      season.episodes.map((episode) => episode)}
                  </TabPanel>
                ))}
          </div>
        </div>
      </Fade>
    </Modal>
  );
}

function TabPanel(props) {
  const classes = useStyles();
  const matches2 = useMediaQuery("(max-width:768px)");

  const {
    children,
    movieID,
    season_number,
    watched,
    seasonTab,
    index,
    ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={seasonTab !== index}
      id={`season-tabpanel-${index}`}
      aria-labelledby={`season-tab-${index}`}
      {...other}
    >
      {seasonTab === index && (
        <Box
          p={matches2 ? 1 : 3}
          className={
            matches2 ? classes.activeTabpanelMobile : classes.activeTabpanel
          }
        >
          {children && (
            <WatchedButton
              movieID={movieID}
              movie={{ season_number, watched }}
              season={true}
            />
          )}
          {children ? (
            children
              .sort((a, b) => a.episode_number - b.episode_number)
              .map((episode, index) => (
                <EpisodeCard key={index} episode={episode} movieID={movieID} />
              ))
          ) : (
            <Typography variant="h6" className={classes.none}>
              No episodes yet
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  index: PropTypes.any.isRequired,
  seasonTab: PropTypes.any.isRequired,
};
