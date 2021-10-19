import Link from "next/link";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import KeyboardArrowUpRoundedIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import EditTitle from "./EditTitle";

const useStyles = makeStyles((theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: "25%",
  },
  tabsMobile: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    minHeight: "fit-content",
    overflow: "visible",
  },
  loader: {
    paddingTop: theme.spacing(2),
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: "25%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tab: {
    fontSize: "0.95rem",
    minWidth: "100%",
    minHeight: "3.6rem",
    paddingLeft: `${theme.spacing(0.75)}px`,
  },
  tabSelected: {
    fontSize: "0.95rem",
    minWidth: "100%",
    minHeight: "3.6rem",
    paddingLeft: `${theme.spacing(0.75)}px`,
    "& > :first-child": {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      justifyContent: "stretch",
      "& > :first-child": {
        gridArea: "1 / 3 / 2 / 4",
        justifySelf: "end",
        marginBottom: "3px",
      },
    },
  },
  tabMobile: {
    fontSize: "0.875rem",
    maxWidth: "100%",
    minWidth: "50%",
    minHeight: "60px",
  },
  tabMobileSelected: {
    fontSize: "0.875rem",
    maxWidth: "100%",
    minWidth: "50%",
    minHeight: "60px",
    "& > :first-child": {
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
      justifyContent: "stretch",
      "& > :first-child": {
        gridArea: "1 / 3 / 2 / 4",
        justifySelf: "end",
        marginBottom: "3px",
      },
    },
  },
  edit: {
    verticalAlign: "middle",
    padding: theme.spacing(0.5),
    borderRadius: "50%",
    color: theme.palette.primary.light,
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  updating: {
    marginLeft: "4px",
  },
  arrows: {
    gridArea: "1 / 1 / 2 / 2",
    justifySelf: "start",
    display: "flex",
    color: theme.palette.primary.light,
    "& > *": {
      lineHeight: 1,
    },
  },
  arrow: {
    borderRadius: "50%",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  name: {
    fontStyle: "italic",
    fontSize: "0.75rem",
  },
}));

function a11yProps(id, idx, val) {
  return {
    id: `tab-${id}`,
    tabIndex: idx,
    "aria-controls": `tabpanel-${id}`,
    "aria-selected": `${idx === val}`,
  };
}

export default function ListTabs({
  id,
  updating,
  setUpdating,
  putData,
  updateSavedList,
  calendar,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const [editTitle, setEditTitle] = React.useState(false);

  const { data: lists, error } = useSWR("/api/lists");
  const { data: savedLists, error: error2 } = useSWR("/api/lists/saved");
  if (error) console.error(error);
  if (error2) console.error(error2);

  const hasLists = lists && lists.length > 0;
  const hasSavedLists = savedLists && savedLists.length > 0;
  const listIDs = hasLists && lists?.map((list) => list._id);
  const savedListIDs = hasSavedLists && savedLists?.map((list) => list.listid);
  var value =
    listIDs && listIDs?.includes(id)
      ? listIDs?.indexOf(id)
      : savedListIDs && savedListIDs?.includes(id)
      ? lists?.length + savedListIDs?.indexOf(id)
      : 0;

  const openEditTitle = () => {
    setEditTitle(true);
  };
  const closeEditTitle = () => {
    setEditTitle(false);
  };

  const moveListUp = (idx) => {
    setUpdating(true);
    const prevPos = lists[idx - 1].position;
    putData({ position: -prevPos });
  };

  const moveListDown = (idx) => {
    setUpdating(true);
    const nextPos = lists[idx + 1].position;
    putData({ position: nextPos });
  };

  const moveSavedListUp = (idx) => {
    setUpdating(true);
    const prevPos = savedLists[idx - 1].position;
    updateSavedList({ position: -prevPos });
  };

  const moveSavedListDown = (idx) => {
    setUpdating(true);
    const nextPos = savedLists[idx + 1].position;
    updateSavedList({ position: nextPos });
  };

  if (!lists || !savedLists)
    return (
      <div className={classes.loader}>
        <CircularProgress size={matches ? "2rem" : "3rem"} thickness={3} />
      </div>
    );

  return (
    (hasLists || hasSavedLists) && (
      <Tabs
        orientation={matches ? "horizontal" : "vertical"}
        variant="scrollable"
        scrollButtons={matches ? "on" : "auto"}
        indicatorColor="secondary"
        aria-label="list tabs"
        value={value}
        className={matches ? classes.tabsMobile : classes.tabs}
        id="list-tabs"
      >
        {lists?.map((list, index) =>
          editTitle && value === index ? (
            <EditTitle
              key={list._id}
              title={list.title}
              closeEditTitle={closeEditTitle}
              updating={updating}
              setUpdating={setUpdating}
              putData={putData}
            />
          ) : (
            <Link
              key={list._id}
              href={
                calendar ? `/lists/calendar/${list._id}` : `/lists/${list._id}`
              }
              replace
              passHref
            >
              <Tab
                data-id={
                  /^Watched$/i.test(list.title) ? "watched-tab" : undefined
                }
                label={list.title}
                wrapped={matches ? false : true}
                disableFocusRipple
                disabled={updating}
                onClick={editTitle ? closeEditTitle : null}
                className={
                  matches && value === index
                    ? classes.tabMobileSelected
                    : matches
                    ? classes.tabMobile
                    : value === index
                    ? classes.tabSelected
                    : classes.tab
                }
                style={value === index ? { opacity: 1 } : undefined}
                {...a11yProps(list._id, index, value)}
                icon={
                  putData &&
                  value === index && (
                    <>
                      {updating ? (
                        <CircularProgress
                          size={matches ? "1.2rem" : "1.5rem"}
                          thickness={5}
                          className={classes.updating}
                        />
                      ) : (
                        <span title="Edit title">
                          {!/^Watched$/i.test(list.title) && (
                            <EditRoundedIcon
                              aria-label="edit title"
                              className={classes.edit}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={openEditTitle}
                            />
                          )}
                        </span>
                      )}
                      <span
                        className={classes.arrows}
                        style={
                          matches
                            ? { flexDirection: "row" }
                            : { flexDirection: "column" }
                        }
                      >
                        {index !== 0 && (
                          <span title="Move up">
                            <KeyboardArrowUpRoundedIcon
                              aria-label="move list up"
                              className={classes.arrow}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={() => moveListUp(index)}
                            />
                          </span>
                        )}
                        {index !== lists.length - 1 && (
                          <span title="Move down">
                            <KeyboardArrowDownRoundedIcon
                              aria-label="move list down"
                              className={classes.arrow}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={() => moveListDown(index)}
                            />
                          </span>
                        )}
                      </span>
                    </>
                  )
                }
              />
            </Link>
          )
        )}
        {savedLists?.map((list, index) =>
          editTitle && value === index + lists?.length ? (
            <EditTitle
              key={list._id}
              title={list.title}
              closeEditTitle={closeEditTitle}
              updating={updating}
              setUpdating={setUpdating}
              putData={putData}
            />
          ) : (
            <Link
              key={list._id}
              href={
                calendar
                  ? `/lists/calendar/${list.listid}${
                      list.uid ? `/${list.uid}` : ""
                    }`
                  : `/lists/${list.listid}${list.uid ? `/${list.uid}` : ""}`
              }
              replace
              passHref
            >
              <Tab
                label={
                  <span>
                    {list.title}
                    <br />
                    <span className={classes.name}>
                      by {list.creator?.name?.split(" ")[0] || "Nameless"}
                    </span>
                  </span>
                }
                wrapped={matches ? false : true}
                disableFocusRipple
                disabled={updating}
                onClick={editTitle ? closeEditTitle : null}
                className={
                  matches && value === index + lists?.length
                    ? classes.tabMobileSelected
                    : matches
                    ? classes.tabMobile
                    : value === index + lists?.length
                    ? classes.tabSelected
                    : classes.tab
                }
                style={{
                  opacity: value === index + lists?.length ? 1 : undefined,
                  lineHeight: 1.2,
                }}
                {...a11yProps(list.listid, index + lists?.length, value)}
                icon={
                  putData &&
                  value === index + lists?.length && (
                    <>
                      {updating ? (
                        <CircularProgress
                          size={matches ? "1.2rem" : "1.5rem"}
                          thickness={5}
                          className={classes.updating}
                        />
                      ) : (
                        <span title="Edit title">
                          {list.uid && (
                            <EditRoundedIcon
                              aria-label="edit title"
                              className={classes.edit}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={openEditTitle}
                            />
                          )}
                        </span>
                      )}
                      <span
                        className={classes.arrows}
                        style={
                          matches
                            ? { flexDirection: "row" }
                            : { flexDirection: "column" }
                        }
                      >
                        {index !== 0 && (
                          <span title="Move up">
                            <KeyboardArrowUpRoundedIcon
                              aria-label="move list up"
                              className={classes.arrow}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={() => moveSavedListUp(index)}
                            />
                          </span>
                        )}
                        {index !== savedLists.length - 1 && (
                          <span title="Move down">
                            <KeyboardArrowDownRoundedIcon
                              aria-label="move list down"
                              className={classes.arrow}
                              style={
                                matches
                                  ? { fontSize: "1.5rem" }
                                  : { fontSize: "1.8rem" }
                              }
                              onClick={() => moveSavedListDown(index)}
                            />
                          </span>
                        )}
                      </span>
                    </>
                  )
                }
              />
            </Link>
          )
        )}
      </Tabs>
    )
  );
}
