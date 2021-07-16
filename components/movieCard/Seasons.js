import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import EpisodeCard from "./EpisodeCard";

function a11yProps(index) {
  return {
    id: `season-tab-${index}`,
    "aria-controls": `season-tabpanel-${index}`,
  };
}

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
    width: "70%",
    overflow: "auto",
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
  tabheader: {
    position: "fixed",
    width: "inherit",
    background: theme.palette.primary.light,
  },
  tabpanel: {
    marginTop: "48px",
  },
  none: {
    width: "100%",
    textAlign: "center",
    marginTop: "8px",
  },
}));

export default function Seasons({ open, onClose, seasons, lastSeason }) {
  const classes = useStyles();

  const [seasonTab, setSeasonTab] = React.useState(
    lastSeason ? lastSeason - 1 : 0
  );

  React.useEffect(() => {
    setSeasonTab(lastSeason ? lastSeason - 1 : 0);
  }, [open, lastSeason]);

  const handleChange = (event, newValue) => {
    setSeasonTab(newValue);

    document.getElementById("seasons").scrollTop = 0;
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
        <div id="seasons" className={classes.seasons}>
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
                      label={"Season " + season.season_number}
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
          <div id="modal-description">
            {seasons &&
              seasons.length > 0 &&
              seasons
                .sort((a, b) => a.season_number - b.season_number)
                .map((season, index) => (
                  <TabPanel
                    key={index}
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

  const { children, seasonTab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={seasonTab !== index}
      id={`season-tabpanel-${index}`}
      aria-labelledby={`season-tab-${index}`}
      {...other}
    >
      {seasonTab === index && (
        <Box p={3}>
          {children ? (
            children
              .sort((a, b) => a.episode_number - b.episode_number)
              .map((episode, index) => (
                <EpisodeCard key={index} episode={episode} />
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
