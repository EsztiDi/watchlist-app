import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function AddMovieButton({
  openSearch,
  handleOpenSearch,
  classes,
}) {
  const matches = useMediaQuery("(max-width:1024px)");

  return matches ? (
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
  ) : (
    <Button
      id="add"
      aria-label="add movie"
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
      &nbsp;Add
    </Button>
  );
}
