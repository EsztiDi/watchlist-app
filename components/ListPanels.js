import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import ListTabs from "./tabs/ListTabs";
import Calendar from "./calendar/Calendar";
import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "calc(100vh - 24px - 24px - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2.5),
  },
  watchlists: {
    width: "100%",
    height: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
  },
}));

export default function ListPanels({
  initialList,
  initialLists,
  setMessage,
  calendar = false,
}) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const { id } = router.query;

  const { data: list, error } = useSWR(id ? `/api/lists/${id}` : null, {
    refreshInterval: 1000,
    initialData: initialList,
  });
  const { data: lists, error: error2 } = useSWR("/api/lists", {
    initialData: initialLists,
  });

  const auth = session && list.user.email === session.user.email;
  const hasLists = lists && lists.length > 0;

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if (list && !auth) {
    router.replace("/lists");
  }

  if (error || error2)
    setMessage(
      `${error.message || error2.message} - Please try again or contact ...`
    );

  if (!list || !lists) return <CircularProgress size="3rem" thickness={3} />;

  return (
    auth &&
    list &&
    hasLists && (
      <Paper elevation={4} className={classes.container}>
        <div className={classes.watchlists}>
          {calendar ? (
            <>
              <ListTabs id={id} lists={lists} />
              <Calendar movies={list.movies} />
            </>
          ) : (
            <Form
              lists={lists}
              list={list}
              setMessage={setMessage}
              newList={false}
            />
          )}
        </div>
      </Paper>
    )
  );
}
