import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: "flex",
    width: "100%",
    height: "calc(100vh - 16px - 16px - 56px)",
    "& > span:first-child": {
      margin: 0,
      // marginRight: theme.spacing(1.5),
    },
    "& span": {
      display: "inline-block",
      margin: theme.spacing(1.5),
    },
    "& div": {
      width: "75%",
      height: "100%",
      display: "flex",
      flexWrap: "wrap",
      alignContent: "flex-start",
      paddingLeft: theme.spacing(3),
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(4),
      "& > span:first-child": {
        marginRight: "auto",
      },
    },
  },
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
  if (error) console.error(error);

  const auth = session && list?.user?.email === session?.user?.email;

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if ((list && !auth) || error) {
    router.replace("/lists");
  }

  if (!list) {
    return (
      <div className={classes.loadingContainer}>
        <Skeleton variant="rect" width={"25%"} height={"100%"} />
        <div>
          <Skeleton variant="circle" width={30} height={30} />
          <Skeleton variant="rect" width={100} height={30} />
          <Skeleton variant="rect" width={100} height={30} />
          <Skeleton variant="circle" width={30} height={30} />
          <Skeleton variant="circle" width={30} height={30} />
          <Skeleton variant="circle" width={30} height={30} />
          <Skeleton variant="rect" width={"100%"} height={210} />
          <Skeleton variant="rect" width={"100%"} height={210} />
          <Skeleton variant="rect" width={"100%"} height={60} />
        </div>
      </div>
    );
  }

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
