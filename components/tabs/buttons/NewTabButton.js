import Link from "next/link";

import IconButton from "@material-ui/core/IconButton";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";

export default function NewTabButton({
  calendar,
  listID,
  editable,
  uid,
  classes,
}) {
  return (
    <Link
      href={`/list${calendar ? "/calendar" : ""}/${listID}${
        editable ? `/${uid}` : ""
      }`}
      passHref
    >
      <IconButton
        target="_blank"
        rel="noopener noreferrer"
        aria-label="open in new tab"
        title="Open in new tab"
        className={classes.button}
      >
        <OpenInNewRoundedIcon className={classes.topIcon} />
      </IconButton>
    </Link>
  );
}
