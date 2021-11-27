import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  emailDialog: {
    textAlign: "center",
  },
  form: {
    "& > *:first-child": {
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(
        2
      )}px`,
    },
    "& h6": {
      paddingTop: theme.spacing(1),
    },
  },
  buttons: {
    justifyContent: "space-evenly",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
  },
}));

export default function EmailLogin({ open, onOpenEmail, signIn, setMessage }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:400px)");
  const [email, setEmail] = useState("");

  const handleChange = (ev) => {
    setEmail(ev.target.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    signIn("email", { email: email });
    setMessage("A sign in link has been sent to your email address.");
    onOpenEmail();
  };

  return (
    <Dialog
      open={open}
      onClose={onOpenEmail}
      aria-labelledby="alert-dialog-title"
      className={classes.emailDialog}
    >
      <DialogTitle id="alert-dialog-title">
        Enter your email address
      </DialogTitle>
      <form onSubmit={handleSubmit} className={classes.form}>
        <DialogContent>
          <TextField
            name="email"
            type="email"
            label="Email address"
            variant="outlined"
            required
            autoFocus
            fullWidth
            onChange={handleChange}
          />
          <Typography variant="subtitle1">
            We&apos;ll email you a magic link for password-free login.
          </Typography>
        </DialogContent>
        <DialogActions className={classes.buttons}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            disableFocusRipple
            onClick={onOpenEmail}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableFocusRipple
            type="submit"
          >
            Send link
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
