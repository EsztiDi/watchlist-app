import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import ListTabs from "../../components/tabs/ListTabs";
import SavedPanel from "../../components/tabs/SavedPanel";

const useStyles = makeStyles((theme) => ({
  skeleton: {
    borderRadius: "4px",
  },
  container: {
    width: "100%",
    height: "calc(100vh - 16px - 16px - 56px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  containerMobile: {
    width: "100%",
    height: "calc(100vh - 20px - 56px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(1),
    paddingTop: 0,
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
  const matches = useMediaQuery("(max-width:1024px)");

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
      <Skeleton
        variant="rect"
        width={"100%"}
        height={
          matches
            ? "calc(100vh - 20px - 56px)"
            : "calc(100vh - 16px - 16px - 56px)"
        }
        className={classes.skeleton}
      />
    );

  return (
    session &&
    lists && (
      <Paper
        elevation={4}
        className={matches ? classes.containerMobile : classes.container}
        id="watchlists"
      >
        <div
          className={classes.watchlists}
          style={
            matches ? { flexDirection: "column" } : { flexDirection: "row" }
          }
        >
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
