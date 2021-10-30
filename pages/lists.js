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
    height: "100%",
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
    hasSavedLists,
    id,
    uid = null;

  const { data, error } = useSWR("/api/lists/newuser");
  if (error) console.error(error);

  if (data) ({ hasLists, hasSavedLists, id, uid } = data);

  if (loading) return null;

  if (!data) return <CircularProgress size="3rem" thickness={3} />;

  if (!loading && !session) {
    router?.replace("/login");
  } else if (hasLists && id) {
    router?.replace(`/lists/${id}`);
    return <CircularProgress size="3rem" thickness={3} />;
  } else if (!hasLists && hasSavedLists && id) {
    router?.replace(`/lists/${id}${uid ? `/${uid}` : ""}`);
    return <CircularProgress size="3rem" thickness={3} />;
  }

  return (
    session &&
    data &&
    !hasLists &&
    !hasSavedLists && (
      <Paper elevation={4} className={classes.container}>
        <Typography variant="h4">Create a watchlist</Typography>
        <Link href="/create" passHref>
          <IconButton aria-label="create new list" className={classes.button}>
            <AddCircleRoundedIcon className={classes.add} />
          </IconButton>
        </Link>
      </Paper>
    )
  );
}
