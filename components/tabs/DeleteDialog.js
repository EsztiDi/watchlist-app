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
  auth,
  onOpenDelete,
  setMessage,
  updating,
  setUpdating,
}) {
  const classes = useStyles();
  const router = useRouter();

  const deleteList = async (id) => {
    setUpdating(true);
    try {
      await fetch(`/api/lists/${id}`, {
        method: "DELETE",
      });

      mutate("/api/lists", async (lists) => {
        const ids = lists.map((el) => el._id);
        const index = ids.indexOf(id) - 1 >= 0 ? ids.indexOf(id) - 1 : 0;
        const filteredLists = lists.filter((list) => list._id !== id);
        await mutate("/api/lists/newuser", (data) => {
          return { ...data, id: filteredLists[index]?._id };
        });
        return lists.filter((list) => list._id !== id);
      });
      setUpdating(false);
      router?.push("/lists");
    } catch (error) {
      setMessage(`${error.message} - Failed to delete list.`);
      setUpdating(false);
    }
  };

  const deleteSavedList = async (id) => {
    try {
      const res = await fetch(`/api/lists/saved/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate("/api/lists/saved", async (lists) => {
        const ids = lists.map((el) => el.listid);
        const index = ids.indexOf(id) - 1 >= 0 ? ids.indexOf(id) - 1 : 0;
        const filteredLists = lists.filter((el) => el.listid !== id);
        await mutate("/api/lists/newuser", (data) => {
          return {
            ...data,
            id: filteredLists[index]?.listid,
            uid: filteredLists[index]?.uid,
          };
        });
        return lists.filter((el) => el.listid !== id);
      });
      setUpdating(false);
      router?.push("/lists");
    } catch (error) {
      setMessage(`${error.message} - Failed to delete list.`);
      setUpdating(false);
    }
  };

  const handleClick = () => {
    auth ? deleteList(listID) : deleteSavedList(listID);
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
        {auth ? "Permanently delete watchlist?" : "Remove saved list?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {auth
            ? "There is no going back."
            : "You can save it again on the list's page."}
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
          onClick={handleClick}
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
