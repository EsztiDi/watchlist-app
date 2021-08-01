import { useRouter } from "next/router";
import { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  delete: {
    textAlign: "center",
  },
  buttons: {
    justifyContent: "space-evenly",
    paddingBottom: theme.spacing(2),
  },
}));

export default function DeleteDialog({
  open,
  listID,
  onOpenDelete,
  setMessage,
  updating,
  setUpdating,
}) {
  const classes = useStyles();
  const router = useRouter();

  const handleDelete = async () => {
    setUpdating(true);
    try {
      await fetch(`/api/lists/${listID}`, {
        method: "Delete",
      });

      mutate("/api/lists");
      setUpdating(false);
      router.push("/lists");
    } catch (error) {
      setMessage(`${JSON.stringify(error.message)} - Failed to delete list.`);
      setUpdating(false);
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
          size="large"
          disableFocusRipple
          disabled={updating}
          onClick={onOpenDelete}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          disableFocusRipple
          autoFocus
          disabled={updating}
          onClick={handleDelete}
        >
          {updating ? (
            <CircularProgress size="1.5rem" thickness={5} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
