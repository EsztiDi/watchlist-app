import { useRouter } from "next/router";
import { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme) => ({
  delete: {
    textAlign: "center",
  },
  buttons: {
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
  },
}));

export default function DeleteDialog({
  open,
  listID,
  onOpenDelete,
  setMessage,
}) {
  const classes = useStyles();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await fetch(`/api/lists/${listID}`, {
        method: "Delete",
      });
      mutate("/api/lists");
      router.push("/lists");
    } catch (error) {
      setMessage(error.message + " - Failed to delete list");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onOpenDelete}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.delete}
    >
      <DialogTitle id="alert-dialog-title">
        {"Permanently delete watchlist?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          There is no going back.
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.buttons}>
        <Button
          variant="contained"
          color="primary"
          disableFocusRipple
          onClick={onOpenDelete}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          disableFocusRipple
          autoFocus
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
