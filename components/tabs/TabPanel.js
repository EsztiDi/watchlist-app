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
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Calendar from "../calendar/Calendar";
import Movies from "../Movies";
import MovieSearch from "../movieSearch/MovieSearch";
import DeleteDialog from "./DeleteDialog";
import Share from "./Share";

const useStyles = makeStyles((theme) => ({
  panel: {
    paddingTop: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    textAlign: "center",
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
    textAlign: "center",
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
  buttonsMobile: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
    columnGap: theme.spacing(1),
    padding: theme.spacing(0.5),
    "& svg": {
      fontSize: "1.7rem",
    },
  },
  label: {
    width: "43%",
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
  updating: {
    position: "absolute",
    bottom: "29px",
    left: "50px",
  },
  updatingMobile: {
    position: "absolute",
    bottom: "37px",
    left: "60px",
  },
  updatingMobile2: {
    position: "absolute",
    bottom: "20px",
    left: "43px",
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
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px 0`,
  },
  searchMobile: {
    position: "relative",
    margin: `${theme.spacing(4)}px 0 0`,
  },
}));

export default function TabPanel(props) {
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

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:455px)");
  const matches3 = useMediaQuery("(max-width:640px)");
  const matches4 = useMediaQuery("(max-width:768px)");

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null);
  if (error) console.error(error);

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
      p={matches ? 0.5 : 2}
      className={!newTab ? classes.panel : classes.newTab}
      role={!newTab ? "tabpanel" : null}
      id={!newTab ? `tabpanel-${listID}` : null}
      aria-labelledby={!newTab ? `tab-${listID}` : null}
      {...other}
    >
      <div className={matches ? classes.buttonsMobile : classes.buttons}>
        {newTab && updating && (
          <CircularProgress
            size="1.5rem"
            thickness={5}
            className={
              matches4
                ? classes.updatingMobile2
                : matches
                ? classes.updatingMobile
                : classes.updating
            }
          />
        )}
        {!newTab && (
          <>
            {!matches ? (
              calendar ? (
                <Link href={`/lists/${listID}`} replace passHref>
                  <IconButton
                    aria-label="list view"
                    title="List view"
                    className={classes.button}
                  >
                    <FormatListBulletedRoundedIcon
                      className={classes.topIcon}
                    />
                  </IconButton>
                </Link>
              ) : (
                <Link href={`/lists/calendar/${listID}`} replace passHref>
                  <IconButton
                    id="calendar"
                    aria-label="calendar view"
                    title="Calendar view"
                    className={classes.button}
                  >
                    <TodayRoundedIcon className={classes.topIcon} />
                  </IconButton>
                </Link>
              )
            ) : (
              ""
            )}
            <FormControlLabel
              id="private"
              label="Private"
              labelPlacement={!matches2 ? "start" : "end"}
              className={matches2 ? classes.label : undefined}
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
              id="emails"
              label="Emails"
              labelPlacement={!matches2 ? "start" : "end"}
              // labelPlacement="start"
              className={matches2 ? classes.label : undefined}
              control={
                <Switch
                  color="primary"
                  name="emails"
                  checked={emails}
                  onChange={onChange}
                />
              }
            />
            {matches ? (
              calendar ? (
                <Link href={`/lists/${listID}`} replace passHref>
                  <IconButton
                    aria-label="list view"
                    title="List view"
                    className={classes.button}
                  >
                    <FormatListBulletedRoundedIcon
                      className={classes.topIcon}
                    />
                  </IconButton>
                </Link>
              ) : (
                <Link href={`/lists/calendar/${listID}`} replace passHref>
                  <IconButton
                    id="calendar"
                    aria-label="calendar view"
                    title="Calendar view"
                    className={classes.button}
                  >
                    <TodayRoundedIcon className={classes.topIcon} />
                  </IconButton>
                </Link>
              )
            ) : (
              ""
            )}
            <IconButton
              id="share"
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
          listID={listID}
          deleteMovie={editable ? deleteMovie : undefined}
          moveMovie={editable ? moveMovie : undefined}
          updating={updating}
          setMessage={setMessage}
        />
      )}
      {editable && !calendar && (
        <div className={matches3 ? classes.searchMobile : classes.search}>
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
