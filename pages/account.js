import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2.5),
  },
  grid: {
    width: "60%",
    margin: "auto",
    textAlign: "left",
    "& > *": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      padding: `${theme.spacing(2.5)}px 0`,
      "& > button": {
        flex: "40%",
        marginLeft: theme.spacing(2.5),
      },
      "& > span": {
        flex: "50%",
      },
    },
  },
  subtitle: {
    fontSize: "1rem",
    fontStyle: "italic",
    color: theme.palette.secondary.dark,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
}));

export default function Account({ setMessage }) {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [updatingPrivate, setUpdatingPrivate] = React.useState(false);
  const [updatingEmails, setUpdatingEmails] = React.useState(false);
  const [deletingLists, setDeletingLists] = React.useState(false);

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  }

  const updateLists = async (emails) => {
    try {
      const res = await fetch(
        emails ? "/api/account/emails" : "/api/account/lists"
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { success } = await res.json();

      setMessage(
        success ? "Changes saved!" : "There was an error, please try again"
      );
      emails ? setUpdatingEmails(false) : setUpdatingPrivate(false);
      console.log(emails);
    } catch (error) {
      setMessage(error.message + " - Failed to update lists");
      emails ? setUpdatingEmails(false) : setUpdatingPrivate(false);
    }
  };

  const handleUpdate = (emails) => {
    emails ? setUpdatingEmails(true) : setUpdatingPrivate(true);
    updateLists(emails);
  };

  const deleteLists = async () => {
    try {
      const res = await fetch("api/account/lists", {
        method: "Delete",
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { success } = await res.json();

      setMessage(
        success ? "All lists deleted!" : "There was an error, please try again"
      );
      setDeletingLists(false);
    } catch (error) {
      setMessage(error.message + " - Failed to delete lists");
      setDeletingLists(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you absoluuuuutely sure?")) {
      setDeletingLists(true);
      deleteLists();
    }
  };

  return (
    session && (
      <Container maxWidth="md" className={classes.container}>
        <Paper elevation={4} className={classes.paper}>
          <Typography variant="h5">Settings</Typography>
          <Typography variant="subtitle2" className={classes.subtitle}>
            Clicking any of these buttons cannot be taken back
          </Typography>
          <Paper elevation={1} className={classes.mainGrid}>
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.grid}
            >
              <Grid item>
                <Typography component="span">
                  Set <b>ALL</b> your lists private:
                  <Typography variant="caption" component="p">
                    (Removes them from the public Discover page.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={updatingPrivate}
                  onClick={() => handleUpdate(false)}
                >
                  Set all private
                </Button>
              </Grid>
              <Grid item>
                <Typography component="span">
                  Unsubscribe from <b>ALL</b> emails:
                  <Typography variant="caption" component="p">
                    (The weekly release summaries.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={updatingEmails}
                  onClick={() => handleUpdate(true)}
                >
                  {updatingEmails ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    "Unsubscribe from all"
                  )}
                </Button>
              </Grid>
              <Grid item>
                <Typography component="span">
                  Delete <b>ALL</b> your lists:
                  <Typography variant="caption" component="p">
                    (Aaaaall of them.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={deletingLists}
                  onClick={handleDelete}
                >
                  {deletingLists ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    <em>Delete everything</em>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Paper>
      </Container>
    )
  );
}
