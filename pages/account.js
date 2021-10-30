import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AccountForm from "../components/AccountForm";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2.5),
  },
  paperMobile: {
    padding: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  grid: {
    margin: "auto",
    textAlign: "left",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    "& > div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      columnGap: theme.spacing(2.5),
      rowGap: theme.spacing(2.5),
      padding: `${theme.spacing(3.5)}px ${theme.spacing(2)}px`,
      "& > button": {
        flex: "30%",
        minWidth: "150px",
      },
      "& > span": {
        flex: "50%",
      },
    },
  },
  subtitle: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: theme.palette.secondary.dark,
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px 0`,
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function Account({ setMessage }) {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  const [updatingForm, setUpdatingForm] = React.useState(false);
  const [updatingPrivate, setUpdatingPrivate] = React.useState(false);
  const [updatingEmails, setUpdatingEmails] = React.useState(false);
  const [deletingLists, setDeletingLists] = React.useState(false);
  const [deletingSavedLists, setDeletingSavedLists] = React.useState(false);
  const [deletingAccount, setDeletingAccount] = React.useState(false);
  var updating =
    updatingForm ||
    updatingPrivate ||
    updatingEmails ||
    deletingLists ||
    deletingSavedLists ||
    deletingAccount;
  const matches = useMediaQuery("(max-width:1024px)");

  React.useEffect(() => {
    const beforeRouteHandler = (url) => {
      if (
        router?.pathname !== url &&
        !confirm("Changes that you made may not be saved.")
      ) {
        router?.events?.emit("routeChangeError");
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    if (updating) {
      window.addEventListener("beforeunload", unloadAlert);
      router?.events?.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    };
    // eslint-disable-next-line
  }, [updating]);

  if (loading) return null;

  if (!loading && !session) {
    router?.replace("/login");
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
        success ? "Changes saved!" : "There was an error, please try again."
      );
      emails ? setUpdatingEmails(false) : setUpdatingPrivate(false);
    } catch (error) {
      setMessage(`${error.message} - Failed to update lists.`);
      emails ? setUpdatingEmails(false) : setUpdatingPrivate(false);
    }
  };

  const handleUpdate = (emails) => {
    emails ? setUpdatingEmails(true) : setUpdatingPrivate(true);
    updateLists(emails);
  };

  const deleteLists = async (lists) => {
    try {
      const res = await fetch(
        lists ? "api/account/lists" : "api/account/delete",
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { success } = await res.json();

      setMessage(
        success
          ? lists
            ? "All lists deleted!"
            : "Account deleted!"
          : "There was an error, please try again."
      );
      lists ? setDeletingLists(false) : setDeletingAccount(false);
      if (!lists) {
        setTimeout(() => {
          router?.reload();
        }, 1000);
      } else {
        mutate("/api/lists");
        mutate("/api/lists/newuser", (data) => {
          return { ...data, hasLists: false, id: undefined, uid: undefined };
        });
      }
    } catch (error) {
      setMessage(
        `${error.message}${
          lists ? " - Failed to delete lists." : " - Failed to delete account."
        }`
      );
      lists ? setDeletingLists(false) : setDeletingAccount(false);
    }
  };

  const handleDelete = (lists) => {
    if (confirm("Are you absoluuuuutely sure?")) {
      lists ? setDeletingLists(true) : setDeletingAccount(true);
      deleteLists(lists);
    }
  };

  const deleteSavedLists = async () => {
    try {
      const res = await fetch("/api/lists/saved", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      const { success } = await res.json();

      setMessage(
        success
          ? "Saved lists deleted!"
          : "There was an error, please try again."
      );
      setDeletingSavedLists(false);
      mutate("/api/lists/saved");
      mutate("/api/lists/newuser", (data) => {
        return { ...data, hasSavedLists: false, id: undefined, uid: undefined };
      });
    } catch (error) {
      setMessage(`${error.message} - Failed to delete saved lists.}`);
      setDeletingSavedLists(false);
    }
  };

  const handleSavedDelete = () => {
    if (confirm("Are you sure?")) {
      setDeletingSavedLists(true);
      deleteSavedLists();
    }
  };

  return (
    session && (
      <>
        <Head>
          <title>Account - My Watchlists</title>
        </Head>
        <Container
          maxWidth="md"
          className={classes.container}
          style={matches ? { padding: 0 } : undefined}
        >
          <Paper
            elevation={4}
            className={matches ? classes.paperMobile : classes.paper}
          >
            <Typography variant="h4" className={classes.title}>
              Settings
            </Typography>
            <AccountForm
              setMessage={setMessage}
              updatingForm={updatingForm}
              setUpdatingForm={setUpdatingForm}
            />
            <Grid
              container
              direction="column"
              wrap="nowrap"
              className={classes.grid}
              style={matches ? { width: "90%" } : { width: "60%" }}
            >
              <Typography variant="button" className={classes.subtitle}>
                Danger zone
              </Typography>
              <Grid item>
                <Typography component="span">
                  Unsubscribe from <b>all</b> emails:
                  <Typography variant="caption" component="p">
                    (The weekly upcoming releases summary.)
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
                    "Unsubscribe all"
                  )}
                </Button>
              </Grid>
              <Divider />
              <Grid item>
                <Typography component="span">
                  Set <b>all</b> your lists private:
                  <Typography variant="caption" component="p">
                    (Remove them from the public Discover page.)
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
              <Divider />
              <Grid item>
                <Typography component="span">
                  Delete all <b>saved</b> lists:
                  <Typography variant="caption" component="p">
                    (Lists others created and you saved.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={deletingSavedLists}
                  onClick={handleSavedDelete}
                >
                  {deletingSavedLists ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    "Delete saved lists"
                  )}
                </Button>
              </Grid>
              <Divider />
              <Grid item>
                <Typography component="span">
                  Delete all <b>your</b> lists:
                  <Typography variant="caption" component="p">
                    (All the lists created by you.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={deletingLists}
                  onClick={() => handleDelete(true)}
                >
                  {deletingLists ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    <em>Delete your lists</em>
                  )}
                </Button>
              </Grid>
              <Divider />
              <Grid item>
                <Typography component="span">
                  <b>Delete your account:</b>
                  <Typography variant="caption" component="p">
                    (Delete ALL your account details and lists from our
                    database.)
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  disableFocusRipple
                  disabled={deletingAccount}
                  onClick={() => handleDelete(false)}
                >
                  {deletingAccount ? (
                    <CircularProgress size="1.5rem" thickness={5} />
                  ) : (
                    <b>
                      <em>Delete account</em>
                    </b>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </>
    )
  );
}
