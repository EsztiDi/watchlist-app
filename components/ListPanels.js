import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  loadingContainer: {
    display: "flex",
    flexWrap: "wrap",
    alignContent: "flex-start",
    justifyContent: "space-evenly",
    width: "100%",
    "& > span:first-child": {
      margin: 0,
    },
    "& span": {
      display: "inline-block",
      margin: theme.spacing(1.5),
    },
  },
  circles: {
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

export default function ListPanels({ setMessage, calendar = false }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const { id } = router.query;
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:480px)");

  const { data: list, error } = useSWR(id ? `/api/lists/${id}` : null);
  if (error) console.error(error);

  const auth = session && list?.user?.email === session?.user?.email;

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if (list && !auth) {
    router.replace("/lists");
  }

  if (!list) {
    return (
      <div
        className={classes.loadingContainer}
        style={
          matches
            ? { height: "auto" }
            : { height: "calc(100vh - 16px - 16px - 56px)" }
        }
      >
        {matches ? (
          <>
            <Skeleton variant="rect" width={"100%"} height={60} />
            <Skeleton
              variant="rect"
              width={matches2 ? "40%" : 100}
              height={30}
            />
            <Skeleton
              variant="rect"
              width={matches2 ? "40%" : 100}
              height={30}
            />
            <Skeleton variant="circle" width={30} height={30} />
            <Skeleton variant="circle" width={30} height={30} />
            <Skeleton variant="circle" width={30} height={30} />
            <Skeleton variant="circle" width={30} height={30} />
            <Skeleton variant="rect" width={"100%"} height={210} />
            <Skeleton variant="rect" width={"100%"} height={210} />
            <Skeleton variant="rect" width={"100%"} height={60} />
          </>
        ) : (
          <>
            <Skeleton variant="rect" width={"25%"} height={"100%"} />
            <div className={classes.circles}>
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
          </>
        )}
      </div>
    );
  }

  return (
    auth &&
    list && (
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
