import IconButton from "@material-ui/core/IconButton";
import HistoryRoundedIcon from "@material-ui/icons/HistoryRounded";

export default function HistoryButton({
  openHistory,
  handleOpenHistory,
  classes,
}) {
  return (
    <IconButton
      aria-label="open history"
      title="History"
      component="span"
      onClick={handleOpenHistory}
      className={classes.button}
      disabled={openHistory}
    >
      <HistoryRoundedIcon className={classes.topIcon} />
    </IconButton>
  );
}
