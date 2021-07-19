import Link from "next/link";
import { useSession, getSession } from "next-auth/client";
import { useRouter } from "next/router";
import mongoose from "mongoose";
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
    height: "calc(100vh - 16px - 16px - 56px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(2.5),
  },
  button: {
    padding: theme.spacing(0.5),
    margin: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  add: {
    fontSize: "3rem",
    color: theme.palette.primary.main,
  },
}));

export default function Lists({ hasLists, id, newUser }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();

  // React.useEffect(() => {
  //   router.prefetch(`/lists/${id}`);
  //   // eslint-disable-next-line
  // }, []);

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
          <Typography variant="h4">Create a watchlist</Typography>
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
  var newUser = null;

  if (session) {
    var results = await Watchlist.find({ user: session.user }, "_id").sort({
      position: -1,
    });
    hasLists = results.length > 0;
    if (hasLists) {
      id = await JSON.parse(JSON.stringify(results[0]._id));
    }

    const user = await new Promise((resolve, reject) => {
      mongoose.connection.db.collection("users", async (err, users) => {
        var user = null;
        try {
          const result = await users.findOne({
            email: session.user.email,
          });
          if (result) {
            user = await JSON.parse(JSON.stringify(result));
          }
          return resolve(user);
        } catch (err) {
          console.error(`Error finding user - ${err}`);
          return resolve();
        }
      });
    });
    newUser = new Date(user?.createdAt) > new Date() - 2 * 60 * 1000;

    if (newUser && !hasLists) {
      try {
        const contentType = "application/json";

        const res1 = await fetch(`${process.env.BASE_URL}/api/lists`, {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify({
            title: "To Watch",
            movies: [],
            private: true,
            emails: false,
            user: session.user,
            position: 1,
          }),
        });

        const res2 = await fetch(`${process.env.BASE_URL}/api/lists`, {
          method: "POST",
          headers: {
            Accept: contentType,
            "Content-Type": contentType,
          },
          body: JSON.stringify({
            title: "Watched",
            movies: [],
            private: true,
            emails: false,
            user: session.user,
            position: 0,
          }),
        });

        if (!res1.ok) {
          throw new Error(res1.status);
        }
        if (!res2.ok) {
          throw new Error(res2.status);
        }
      } catch (err) {
        console.error(err.message + " - Failed to add first lists");
      }
      var results = await Watchlist.find({ user: session.user }, "_id").sort({
        position: -1,
      });
      hasLists = results.length > 0;
      if (hasLists) {
        id = await JSON.parse(JSON.stringify(results[0]._id));
      }
    }
  }

  return { props: { hasLists, id, newUser } };
}
