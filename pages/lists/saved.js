import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

import ListTabs from "../../components/tabs/ListTabs";
import SavedPanel from "../../components/tabs/SavedPanel";

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    height: "calc(100vh - 16px - 16px - 56px)",
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

export default function SavedLists({ setMessage }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const [updating, setUpdating] = React.useState(false);

  const { data: lists, error } = useSWR(session ? "/api/lists/saved" : null);
  if (error) console.error(error);

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  }

  if (lists && lists.length === 0) {
    router.push("/lists");
  }

  if (!lists)
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress size="3rem" thickness={3} />
      </div>
    );

  return (
    session &&
    lists && (
      <Paper elevation={4} className={classes.container} id="watchlists">
        <div className={classes.watchlists}>
          <ListTabs
            id={null}
            updating={updating}
            setUpdating={null}
            putData={null}
            calendar={false}
            saved={true}
          />
          <SavedPanel
            lists={lists}
            updating={updating}
            setUpdating={setUpdating}
            setMessage={setMessage}
          />
        </div>
      </Paper>
    )
  );
}
