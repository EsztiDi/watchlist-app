import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  editTitle: {
    padding: theme.spacing(1),
    // width: "100%",
    // maxWidth: "264px",
  },
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "2rem",
  },
}));

export default function EditTitle({
  title,
  onEditTitle,
  updating,
  setUpdating,
  putData,
}) {
  const classes = useStyles();
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
      putData(newTitle).then(() => onEditTitle());
    } else {
      onEditTitle();
    }
  };

  return (
    <ClickAwayListener onClickAway={onEditTitle}>
      <form onSubmit={handleSubmit} className={classes.editTitle}>
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
                      className={classes.icon}
                      color="primary"
                    />
                  )}
                </IconButton>
                <IconButton
                  aria-label="cancel"
                  onClick={onEditTitle}
                  className={classes.button}
                >
                  <HighlightOffRoundedIcon
                    className={classes.icon}
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
