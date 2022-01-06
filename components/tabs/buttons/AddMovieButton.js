import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";

export default function AddMovieButton({
  openSearch,
  handleOpenSearch,
  classes,
}) {
  return (
    <IconButton
      id="add"
      aria-label="add movie"
      title="Add movie"
      onClick={handleOpenSearch}
      className={classes.button}
    >
      {openSearch ? (
        <AddCircleRoundedIcon
          className={classes.topIcon}
          style={{ transform: "rotate(45deg)" }}
        />
      ) : (
        <AddCircleOutlineRoundedIcon className={classes.topIcon} />
      )}
    </IconButton>
  );
}
