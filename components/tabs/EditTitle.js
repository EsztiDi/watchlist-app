import { useState } from "react";
import { mutate } from "swr";
import updateChanges from "../../utils/updateChanges";

import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  editTitle: {
    padding: theme.spacing(0.75),
  },
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "1.8rem",
  },
  iconMobile: {
    fontSize: "1.6rem",
  },
}));

export default function EditTitle({
  listID,
  title,
  closeEditTitle,
  updating,
  setUpdating,
  putData,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");

  const [newTitle, setTitle] = useState({ title });

  const handleChange = (ev) => {
    setTitle({
      title: ev.target.value,
    });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (newTitle.title !== title) {
      setUpdating(true);
      putData(newTitle).then(async () => {
        // Add info to change log
        await updateChanges(listID, {
          action: "title",
          change: `${title} \u27A2 ${newTitle.title}`,
          newTitle: newTitle.title,
          oldTitle: title,
        });
        mutate(`/api/lists/changes/${listID}`);
        closeEditTitle();
      });
    } else {
      closeEditTitle();
    }
  };

  return (
    <ClickAwayListener onClickAway={closeEditTitle}>
      <form
        onSubmit={handleSubmit}
        className={classes.editTitle}
        style={matches2 ? { minWidth: "100%" } : { minWidth: "50%" }}
      >
        <TextField
          name="title"
          label="Title"
          defaultValue={title}
          variant="outlined"
          required
          autoFocus
          fullWidth
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="save"
                  type="submit"
                  disabled={updating}
                  className={classes.button}
                >
                  {updating ? (
                    <CircularProgress
                      size={matches ? "1.3rem" : "1.5rem"}
                      thickness={5}
                    />
                  ) : (
                    <CheckCircleOutlineRoundedIcon
                      className={matches ? classes.iconMobile : classes.icon}
                      color="primary"
                    />
                  )}
                </IconButton>
                <IconButton
                  aria-label="cancel"
                  onClick={closeEditTitle}
                  disabled={updating}
                  className={classes.button}
                >
                  <HighlightOffRoundedIcon
                    className={matches ? classes.iconMobile : classes.icon}
                    color="secondary"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </ClickAwayListener>
  );
}
