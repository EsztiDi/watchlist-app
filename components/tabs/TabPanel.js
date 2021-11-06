import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
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
  tooltip: {
    fontSize: "0.85rem",
    textAlign: "center",
    lineHeight: 1.3,
    margin: theme.spacing(0.6),
  },
  tooltipPadding: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    margin: `${theme.spacing(2.5)}px 0 ${theme.spacing(1)}px`,
  },
  miniIcon: {
    fontSize: "1rem!important",
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(0.25),
  },
  label: {
    width: "45%",
    whiteSpace: "nowrap",
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
    left: "13px",
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
    emails,
    ...other
  } = props;

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");
  const matches3 = useMediaQuery("(max-width:490px)");

  const router = useRouter();
  const { id: ids } = router?.query;
  const [session] = useSession();

  const { data: lists } = useSWR("/api/lists");
  const { data: savedLists } = useSWR("/api/lists/saved");
  const hasLists = lists && lists.length > 0;
  const hasSavedLists = savedLists && savedLists.length > 0;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null);
  if (error) console.error(error);

  var title, privateList, createdAt;

  if (list) {
    ({ title, private: privateList, createdAt } = list);
  }

  useEffect(() => {
    if (!newTab && document.getElementById(`tabpanel-${listID}`))
      document.getElementById(`tabpanel-${listID}`).scrollTop = 0;
  }, [listID, newTab]);

  // Locale for Calendar and Movies
  const [loc, setLoc] = useState("");
  useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const getLocale = async () => {
      await fetch("/api/account/locale", { signal })
        .then((res) => res.json())
        .then((res) => {
          if (isMounted) setLoc(res.data || "US");
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getLocale();

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  // For DeleteDialog
  const [openDelete, setOpenDelete] = useState(false);

  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  };

  // For Share modal and editable parts
  const [openShare, setOpenShare] = useState(false);
  const uid = new Date(createdAt).getTime().toString().substring(0, 12);
  const auth = session && list?.user?.email === session?.user?.email;
  const editable = ids.length > 1 ? ids[1] === uid : auth;

  const handleOpenShare = () => {
    setOpenShare((prev) => !prev);
  };

  return (
    (hasLists || hasSavedLists || newTab) && (
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
                matches2
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
                  <Link
                    href={`/lists/${listID}${ids.length > 1 ? `/${uid}` : ""}`}
                    replace
                    passHref
                  >
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
                  <Link
                    href={`/lists/calendar/${listID}${
                      ids.length > 1 ? `/${uid}` : ""
                    }`}
                    replace
                    passHref
                  >
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
              {auth && (
                <span className={matches3 ? classes.label : undefined}>
                  <FormControlLabel
                    id="private"
                    label={
                      <>
                        <span>Private</span>
                        <Tooltip
                          arrow
                          enterDelay={400}
                          enterNextDelay={400}
                          enterTouchDelay={50}
                          leaveTouchDelay={5000}
                          classes={{
                            tooltip: classes.tooltipPadding,
                          }}
                          title={
                            <p className={classes.tooltip}>
                              Private lists are NOT featured on the{" "}
                              <em>Discover</em> page but can still be shared by
                              you
                            </p>
                          }
                        >
                          <HelpOutlineRoundedIcon
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                            className={classes.miniIcon}
                          />
                        </Tooltip>
                      </>
                    }
                    labelPlacement={!matches3 ? "start" : "end"}
                    control={
                      <Switch
                        color="primary"
                        name="private"
                        checked={privateList}
                        onChange={onChange}
                      />
                    }
                  />
                </span>
              )}
              <span className={matches3 ? classes.label : undefined}>
                <FormControlLabel
                  id="emails"
                  label={
                    <>
                      <span>Emails</span>
                      <Tooltip
                        arrow
                        enterDelay={400}
                        enterNextDelay={400}
                        enterTouchDelay={50}
                        leaveTouchDelay={5000}
                        classes={{
                          tooltip: classes.tooltipPadding,
                        }}
                        title={
                          <p className={classes.tooltip}>
                            Include this list in the weekly releases summary
                            email on Thursdays
                          </p>
                        }
                      >
                        <HelpOutlineRoundedIcon
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className={classes.miniIcon}
                        />
                      </Tooltip>
                    </>
                  }
                  labelPlacement={!matches3 ? "start" : "end"}
                  control={
                    <Switch
                      color="primary"
                      name="emails"
                      checked={emails}
                      onChange={onChange}
                    />
                  }
                />
              </span>
              {matches ? (
                calendar ? (
                  <Link
                    href={`/lists/${listID}${ids.length > 1 ? `/${uid}` : ""}`}
                    replace
                    passHref
                  >
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
                  <Link
                    href={`/lists/calendar/${listID}${
                      ids.length > 1 ? `/${uid}` : ""
                    }`}
                    replace
                    passHref
                  >
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
                component="span"
                onClick={handleOpenShare}
                className={classes.button}
                disabled={openShare}
              >
                <ShareRoundedIcon className={classes.topIcon} />
              </IconButton>
              <Share
                listID={listID}
                uid={uid}
                title={title}
                open={openShare}
                onClose={handleOpenShare}
              />
              <Link
                href={
                  calendar
                    ? `/list/calendar/${listID}${
                        ids.length > 1 ? `/${uid}` : ""
                      }`
                    : `/list/${listID}${ids.length > 1 ? `/${uid}` : ""}`
                }
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
                title={auth ? "Delete" : "Remove"}
                disabled={updating}
                onClick={handleOpenDelete}
                className={classes.button}
              >
                <HighlightOffRoundedIcon className={classes.delete} />
              </IconButton>
              <DeleteDialog
                open={openDelete}
                listID={listID}
                auth={auth}
                onOpenDelete={handleOpenDelete}
                setMessage={setMessage}
                updating={updating}
                setUpdating={setUpdating}
              />
            </>
          )}
        </div>

        {calendar ? (
          <Calendar listID={listID} loc={loc} newTab={newTab} />
        ) : (
          <Movies
            listID={listID}
            loc={loc}
            deleteMovie={editable ? deleteMovie : undefined}
            moveMovie={editable ? moveMovie : undefined}
            updating={updating}
            setMessage={setMessage}
          />
        )}
        {editable && !calendar && (
          <div className={matches2 ? classes.searchMobile : classes.search}>
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
    )
  );
}
