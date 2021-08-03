import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    height: "calc(100vh - 16px - 16px - 56px - 68px - 8px)",
  },
  container: {
    width: "100%",
    height: "calc(100vh - 16px - 16px - 56px)",
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

export default function ListPanels({ setMessage, calendar = false }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const { id } = router.query;

  const { data: list, error } = useSWR(id ? `/api/lists/${id}` : null);

  const auth = session && list?.user?.email === session?.user?.email;

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if ((list && !auth) || error) {
    router.replace("/lists");
  }

  if (!list)
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size="3rem" thickness={3} />
      </div>
    );

  return (
    auth &&
    list && (
      <Paper elevation={4} className={classes.container} id="watchlists">
        <div className={classes.watchlists}>
          <Form
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
