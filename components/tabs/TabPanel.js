import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import AddMovieButton from "./buttons/AddMovieButton";
import Toggle from "./buttons/Toggle";
import DeleteButton from "./buttons/DeleteButton";
import ViewButton from "./buttons/ViewButton";
import NewTabButton from "./buttons/NewTabButton";
import ShareButton from "./buttons/ShareButton";
const DeleteDialog = dynamic(() => import("./DeleteDialog"));
const Share = dynamic(() => import("./Share"));
const MovieSearch = dynamic(() => import("../movieSearch/MovieSearch"));
const Calendar = dynamic(() => import("../calendar/Calendar"));
const Movies = dynamic(() => import("../Movies"));

const useStyles = makeStyles((theme) => ({
  panel: {
    paddingTop: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    textAlign: "center",
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
  newTab: {
    padding: 0,
    textAlign: "center",
  },
  buttons: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    columnGap: theme.spacing(1),
    "& > *:first-child": {
      marginLeft: theme.spacing(1),
      marginRight: "auto",
    },
    "& > *:last-child": {
      marginRight: theme.spacing(1),
    },
  },
  buttonsMobile: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: theme.spacing(1),
    rowGap: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    "& svg": {
      fontSize: "1.6rem",
    },
  },
  subButtons: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    columnGap: theme.spacing(1),
  },
  button: {
    padding: theme.spacing(0.5),
  },
  topIcon: {
    fontSize: "1.7rem",
    color: theme.palette.primary.light,
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  search: {
    position: "relative",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  searchMobile: {
    position: "relative",
    margin: `${theme.spacing(4)}px 0 ${theme.spacing(2)}px`,
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
    calendar,
    emails,
    openSearch2,
    ...other
  } = props;

  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");

  const router = useRouter();
  const { id: ids } = router?.query;
  const [session] = useSession();

  const { data: lists } = useSWR("/api/lists");
  const { data: savedLists } = useSWR("/api/lists/saved");
  const hasLists = lists && lists.length > 0;
  const hasSavedLists = savedLists && savedLists.length > 0;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null);
  if (error) console.error(error);

  var title, privateList, shared, createdAt;
  if (list) {
    ({ title, private: privateList, shared, createdAt } = list);
  }

  useEffect(() => {
    var panel = document.getElementById(`tabpanel-${listID}`);
    if (!newTab && panel) {
      panel.scrollTop = 0;
      setOpenSearch(false);
    }
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

  // For AddMovieButton
  const [openSearch, setOpenSearch] = useState(false);
  const handleOpenSearch = () => {
    setOpenSearch((prev) => !prev);
  };

  // For DeleteDialog
  const [openDelete, setOpenDelete] = useState(false);
  const handleOpenDelete = () => {
    setOpenDelete((prev) => !prev);
  };

  // For Share modal and editable parts
  const [openShare, setOpenShare] = useState(false);
  const uid = new Date(createdAt).getTime().toString().substring(0, 12);
  const auth = session && list?.user?.email === session?.user?.email;
  const editable = ids.length > 1 ? ids[1] === uid : auth && !newTab;

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
        {matches && !newTab && (
          <div className={classes.buttonsMobile}>
            {auth && (
              <Toggle
                privateToggle={true}
                privateList={privateList}
                onChange={onChange}
              />
            )}
            <Toggle privateToggle={false} emails={emails} onChange={onChange} />
            <span className={classes.subButtons} style={{ flexGrow: 1 }}>
              <DeleteButton
                auth={auth}
                updating={updating}
                handleOpenDelete={handleOpenDelete}
                classes={{ button: classes.button }}
              />
              <NewTabButton
                calendar={calendar}
                listID={listID}
                editable={ids?.length > 0}
                uid={uid}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
              <ShareButton
                handleOpenShare={handleOpenShare}
                openShare={openShare}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
              {calendar ? (
                <ViewButton
                  listID={listID}
                  editable={ids?.length > 0}
                  uid={uid}
                  classes={{ button: classes.button, topIcon: classes.topIcon }}
                />
              ) : (
                <ViewButton
                  calendar={true}
                  listID={listID}
                  editable={ids?.length > 0}
                  uid={uid}
                  classes={{ button: classes.button, topIcon: classes.topIcon }}
                />
              )}
              {editable && !calendar && (
                <AddMovieButton
                  listID={listID}
                  openSearch={openSearch}
                  handleOpenSearch={handleOpenSearch}
                />
              )}
            </span>
          </div>
        )}
        {!matches && !newTab && (
          <div className={classes.buttons}>
            {calendar ? (
              <ViewButton
                listID={listID}
                editable={ids?.length > 0}
                uid={uid}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
            ) : (
              <ViewButton
                calendar={true}
                listID={listID}
                editable={ids?.length > 0}
                uid={uid}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
            )}
            {editable && !calendar && (
              <AddMovieButton
                openSearch={openSearch}
                handleOpenSearch={handleOpenSearch}
              />
            )}
            {auth && (
              <Toggle
                privateToggle={true}
                privateList={privateList}
                onChange={onChange}
              />
            )}
            <Toggle privateToggle={false} emails={emails} onChange={onChange} />
            <span className={classes.subButtons}>
              <ShareButton
                handleOpenShare={handleOpenShare}
                openShare={openShare}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
              <NewTabButton
                calendar={calendar}
                listID={listID}
                editable={ids?.length > 0}
                uid={uid}
                classes={{ button: classes.button, topIcon: classes.topIcon }}
              />
              <DeleteButton
                auth={auth}
                updating={updating}
                handleOpenDelete={handleOpenDelete}
                classes={{ button: classes.button }}
              />
            </span>
          </div>
        )}
        {!newTab && (
          <>
            {openShare && (
              <Share
                listID={listID}
                uid={editable || auth ? uid : ""}
                auth={auth}
                shared={shared}
                title={title}
                open={openShare}
                onClose={handleOpenShare}
              />
            )}
            {openDelete && (
              <DeleteDialog
                open={openDelete}
                listID={listID}
                auth={auth}
                onOpenDelete={handleOpenDelete}
                setMessage={setMessage}
                updating={updating}
                setUpdating={setUpdating}
              />
            )}
          </>
        )}
        {editable && !calendar && (
          <Collapse in={openSearch || openSearch2}>
            <div className={matches2 ? classes.searchMobile : classes.search}>
              <MovieSearch
                addMovie={addMovie}
                newList={newList}
                setUpdating={setUpdating}
                listID={listID}
                watched={/^Watched$/i.test(title).toString()}
              />
            </div>
          </Collapse>
        )}
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
      </Box>
    )
  );
}
