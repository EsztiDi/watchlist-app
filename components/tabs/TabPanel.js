import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import IconButton from "@material-ui/core/IconButton";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";
import TodayRoundedIcon from "@material-ui/icons/TodayRounded";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

import Calendar from "../calendar/Calendar";
import Movies from "../Movies";
import MovieSearch from "../movieSearch/MovieSearch";
import DeleteDialog from "./DeleteDialog";
import Share from "./Share";

const useStyles = makeStyles((theme) => ({
  panel: {
    paddingTop: 0,
    width: "100%",
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
    fontSize: "1.9rem",
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
    fontSize: "1.9rem",
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
    id: listID,
    newTab,
    newList,
    updating,
    setUpdating,
    setMessage,
    onChange,
    addMovie,
    deleteMovie,
    moveMovie,
    addingMovie,
    calendar,
    ...other
  } = props;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null);

  var title, privateList, emails, createdAt;

  if (list) {
    ({ title, private: privateList, emails, createdAt } = list);
  }

  React.useEffect(() => {
    if (!newTab) document.getElementById(`tabpanel-${listID}`).scrollTop = 0;
  }, [listID, newTab]);

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
  const { id: ids } = router.query;
  const editable = newTab ? ids[1] === uid : true;

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
        {calendar ? (
          <Link
            href={
              editable && newTab
                ? `/list/${listID}/${uid}`
                : newTab
                ? `/list/${listID}`
                : `/lists/${listID}`
            }
            replace={newTab ? false : true}
            passHref
          >
            <IconButton
              aria-label="list view"
              title="List view"
              className={newTab ? classes.calendar : classes.button}
            >
              <FormatListBulletedRoundedIcon className={classes.topIcon} />
            </IconButton>
          </Link>
        ) : (
          <Link
            href={
              editable && newTab
                ? `/list/calendar/${listID}/${uid}`
                : newTab
                ? `/list/calendar/${listID}`
                : `/lists/calendar/${listID}`
            }
            replace={newTab ? false : true}
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
        )}
        {newTab && updating && (
          <CircularProgress
            size="1.5rem"
            thickness={5}
            className={classes.updating}
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
            <Link
              href={calendar ? `/list/calendar/${listID}` : `/list/${listID}`}
              passHref
            >
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
              disabled={updating}
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
              updating={updating}
              setUpdating={setUpdating}
            />
          </>
        )}
      </div>

      {calendar ? (
        <Calendar listID={listID} newTab={newTab} />
      ) : (
        <Movies
          movies={[]}
          listID={listID}
          deleteMovie={editable ? deleteMovie : undefined}
          moveMovie={editable ? moveMovie : undefined}
          updating={updating}
        />
      )}
      {editable && !calendar && (
        <div className={classes.search}>
          <MovieSearch
            addMovie={addMovie}
            addingMovie={addingMovie}
            newList={newList}
            setUpdating={setUpdating}
            listID={listID}
          />
        </div>
      )}
    </Box>
  );
}
