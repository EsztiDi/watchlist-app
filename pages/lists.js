import Link from "next/link";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import dbConnect from "../utils/dbConnect";
import Watchlist from "../models/Watchlist";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    height: "calc(100vh - 24px - 24px - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2.5),
  },
  button: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(1),
  },
  add: {
    fontSize: "2.5rem",
    color: theme.palette.primary.main,
  },
}));

export default function Lists({ hasLists, id }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();

  React.useEffect(() => {
    router.prefetch(`/lists/${id}`);
    // eslint-disable-next-line
  }, []);

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  } else if (hasLists) {
    router.replace(`/lists/${id}`);
    return <CircularProgress size="3rem" thickness={3} />;
  }

  return (
    session &&
    !hasLists && (
      <Paper elevation={4} className={classes.container}>
        <>
          <Typography variant="h5">Create a watchlist</Typography>
          <Link href="/create" passHref>
            <IconButton className={classes.button}>
              <AddCircleRoundedIcon className={classes.add} />
            </IconButton>
          </Link>
        </>
      </Paper>
    )
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  await dbConnect();

  var hasLists = null;
  var id = null;

  if (session) {
    const results = await Watchlist.find({ user: session.user }, "_id").sort({
      position: 1,
    });
    hasLists = results.length > 0;
    if (hasLists) {
      id = await JSON.parse(JSON.stringify(results[0]._id));
    }
  }

  return { props: { hasLists, id } };
}
