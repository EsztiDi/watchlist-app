import IconButton from "@material-ui/core/IconButton";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";

export default function ShareButton({ handleOpenShare, openShare, classes }) {
  return (
    <IconButton
      id="share"
      aria-label="share watchlist"
      title="Share"
      component="span"
      onClick={handleOpenShare}
      className={classes.button}
      disabled={openShare}
    >
      <ShareRoundedIcon className={classes.topIcon} />
    </IconButton>
  );
}
