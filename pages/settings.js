import { useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: "center",
  },
  paper: {
    padding: theme.spacing(2.5),
  },
  mainGrid: {
    width: "80%",
    margin: "auto",
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
  },
  grid: {
    textAlign: "left",
    width: "40%",
    "&:first-child": {
      marginRight: theme.spacing(5),
    },
    "& > *": {
      margin: `${theme.spacing(2.5)}px 0`,
      "& > button": {
        marginLeft: theme.spacing(2.5),
      },
    },
    "& > p": {
      padding: `${theme.spacing(0.75)}px 0`,
    },
  },
  subtitle: {
    fontSize: "1rem",
    fontStyle: "italic",
    color: theme.palette.secondary.dark,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
}));

export default function Settings({ setMessage }) {
  const classes = useStyles();
  const router = useRouter();
  const [session, loading] = useSession();
  //   const [updating, setUpdating] = React.useState(false);

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  }

  const handleDeleteEverything = () => {
    if (confirm("Are you absolutely completely totally sure?"))
      console.log("confirmed");
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
              justify="space-evenly"
              alignItems="flex-start"
              wrap="nowrap"
              className={classes.grid}
            >
              <Typography>Set ALL your lists private:</Typography>
              <Typography>Unsubscribe from ALL emails:</Typography>
              <Typography>Delete your account and all your lists:</Typography>
            </Grid>
            <Grid
              container
              direction="column"
              justify="space-evenly"
              alignItems="flex-start"
              wrap="nowrap"
              className={classes.grid}
            >
              <Button
                variant="contained"
                color="secondary"
                disableFocusRipple
                //   onClick={handleDelete}
              >
                Set all private
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disableFocusRipple
                //   onClick={handleDelete}
              >
                Unsubscribe from all
              </Button>
              <Button
                variant="contained"
                color="secondary"
                disableFocusRipple
                onClick={handleDeleteEverything}
              >
                Delete everything
              </Button>
            </Grid>
          </Paper>
        </Paper>
      </Container>
    )
  );
}
