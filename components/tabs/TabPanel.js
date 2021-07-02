import Link from "next/link";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import TodayRoundedIcon from "@material-ui/icons/TodayRounded";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

import Movies from "../Movies";
import MovieSearch from "../movieSearch/MovieSearch";
import DeleteDialog from "./DeleteDialog";
import Share from "./Share";

const useStyles = makeStyles((theme) => ({
  panel: {
    width: "100%",
    scrollBehavior: "smooth",
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
  newTab: {
    padding: 0,
  },
  buttons: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginRight: theme.spacing(1),
    },
    "& > *:first-child": {
      marginLeft: theme.spacing(1),
      marginRight: "auto",
    },
  },
  button: {
    padding: theme.spacing(0.5),
  },
  topIcon: {
    fontSize: "2rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  calendar: {
    padding: theme.spacing(0.5),
    position: "absolute",
    bottom: "19px",
    right: "24px",
  },
  updating: {
    position: "absolute",
    bottom: "27px",
    left: "30px",
  },
  delete: {
    fontSize: "2rem",
    color: theme.palette.secondary.light,
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
  search: {
    position: "relative",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
}));

export default function TabPanel(props) {
  const classes = useStyles();
  const {
    list,
    newTab,
    updating,
    setUpdating,
    setMessage,
    onChange,
    addMovie,
    deleteMovie,
    moveMovie,
    ...other
  } = props;
  const {
    _id: listID,
    title,
    private: privateList,
    emails,
    movies,
    createdAt,
  } = list;

  // For DeleteDialog
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  };

  // For Share modal
  const [openShare, setOpenShare] = React.useState(false);
  const uid = new Date(createdAt).getTime().toString().substring(0, 12);

  const handleOpenShare = () => {
    setOpenShare((prev) => !prev);
  };

  // For new tab (ListPage)
  const router = useRouter();
  const { id } = router.query;
  const editable = newTab ? id[1] === uid : true;

  return (
    <Box
      p={2}
      className={!newTab ? classes.panel : classes.newTab}
      role={!newTab ? "tabpanel" : null}
      id={!newTab ? `tabpanel-${listID}` : null}
      aria-labelledby={!newTab ? `tab-${listID}` : null}
      {...other}
    >
      <div className={classes.buttons}>
        <Link
          href={
            newTab ? `/list/calendar/${listID}` : `/lists/calendar/${listID}`
          }
          passHref
        >
          <IconButton
            aria-label="calendar view"
            title="Calendar view"
            className={newTab ? classes.calendar : classes.button}
          >
            <TodayRoundedIcon className={classes.topIcon} />
          </IconButton>
        </Link>
        {updating && (
          <CircularProgress
            size="1.5rem"
            thickness={5}
            className={newTab ? classes.updating : null}
          />
        )}
        {!newTab && (
          <>
            <FormControlLabel
              label="Private"
              labelPlacement="start"
              control={
                <Switch
                  color="primary"
                  name="private"
                  checked={privateList}
                  onChange={onChange}
                />
              }
            />
            <FormControlLabel
              label="Emails"
              labelPlacement="start"
              control={
                <Switch
                  color="primary"
                  name="emails"
                  checked={emails}
                  onChange={onChange}
                />
              }
            />
            <IconButton
              aria-label="share watchlist"
              title="Share"
              onClick={handleOpenShare}
              className={classes.button}
              disabled={openShare}
            >
              <ShareRoundedIcon className={classes.topIcon} />
              <Share
                listID={listID}
                uid={uid}
                title={title}
                open={openShare}
                onClose={handleOpenShare}
              />
            </IconButton>
            <Link href={`/list/${listID}`} passHref>
              <IconButton
                target="_blank"
                rel="noopener noreferrer"
                aria-label="open in new tab"
                title="Open in new tab"
                className={classes.button}
              >
                <OpenInNewRoundedIcon className={classes.topIcon} />
              </IconButton>
            </Link>
            <IconButton
              aria-label="delete watchlist"
              title="Delete"
              onClick={handleOpenDelete}
              className={classes.button}
            >
              <HighlightOffRoundedIcon className={classes.delete} />
            </IconButton>
            <DeleteDialog
              open={openDelete}
              listID={listID}
              onOpenDelete={handleOpenDelete}
              setMessage={setMessage}
            />
          </>
        )}
      </div>

      <Movies
        movies={movies}
        deleteMovie={editable ? deleteMovie : undefined}
        moveMovie={editable ? moveMovie : undefined}
        updating={updating}
      />

      {editable && (
        <div className={classes.search}>
          <MovieSearch addMovie={addMovie} />
        </div>
      )}
    </Box>
  );
}
