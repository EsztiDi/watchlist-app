import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "calc(100vh - 24px - 24px - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
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
    refreshInterval: 2000,
    initialData: initialList,
    isPaused: () => {
      if (error) return true;
    },
  });
  const { data: lists, error: error2 } = useSWR(session ? "/api/lists" : null, {
    refreshInterval: 2000,
    initialData: initialLists,
    isPaused: () => {
      if (error) return true;
    },
  });

  const auth = session && list?.user?.email === session?.user?.email;
  const hasLists = lists && lists.length > 0;

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if ((list && !auth) || error || error2) {
    router.replace("/lists");
  }

  if ((!list || !lists) && (!error || !error2))
    return <CircularProgress size="3rem" thickness={3} />;

  return (
    auth &&
    list &&
    hasLists && (
      <Paper elevation={4} className={classes.container}>
        <div className={classes.watchlists}>
          <Form
            lists={lists}
            list={list}
            setMessage={setMessage}
            calendar={calendar}
            newList={false}
          />
        </div>
      </Paper>
    )
  );
}
