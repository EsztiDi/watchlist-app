import Link from "next/link";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";

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

export default function Lists() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  var hasLists,
    id = null;

  const { data, error } = useSWR("/api/lists/newuser");
  const { data: savedLists, error2 } = useSWR(
    session ? "/api/lists/saved" : null
  );
  if (error) console.error(error);
  if (error2) console.error(error2);

  if (data) ({ hasLists, id } = data);
  const hasSavedLists = savedLists && savedLists.length > 0;

  if (loading) return null;

  if (!data) return <CircularProgress size="3rem" thickness={3} />;

  if (!loading && !session) {
    router.replace("/login");
  } else if (hasLists && id !== undefined) {
    router.replace(`/lists/${id}`);
    return <CircularProgress size="3rem" thickness={3} />;
  } else if (!data?.movies && !hasLists && hasSavedLists) {
    router.replace(`/lists/saved`);
    return <CircularProgress size="3rem" thickness={3} />;
  }

  return (
    session &&
    data &&
    !data?.movies &&
    !hasLists &&
    !hasSavedLists && (
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
