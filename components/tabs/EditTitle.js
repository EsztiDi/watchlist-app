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
    padding: theme.spacing(1),
  },
  editTitleMobile: {
    padding: theme.spacing(1),
    minWidth: "100%",
  },
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "2rem",
  },
  iconMobile: {
    fontSize: "1.6rem",
  },
}));

export default function EditTitle({
  title,
  closeEditTitle,
  updating,
  setUpdating,
  putData,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");
  const [newTitle, setTitle] = React.useState({ title });

  const handleChange = (ev) => {
    setTitle({
      title: ev.target.value,
    });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUpdating(true);

    if (newTitle.title !== title) {
      putData(newTitle).then(() => {
        closeEditTitle();
        setUpdating(false);
      });
    } else {
      closeEditTitle();
      setUpdating(false);
    }
  };

  return (
    <ClickAwayListener onClickAway={closeEditTitle}>
      <form
        onSubmit={handleSubmit}
        className={matches ? classes.editTitleMobile : classes.editTitle}
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
                    <CircularProgress size="1.5rem" thickness={5} />
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
