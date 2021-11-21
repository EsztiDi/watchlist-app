import Link from "next/link";

import IconButton from "@material-ui/core/IconButton";
import TodayRoundedIcon from "@material-ui/icons/TodayRounded";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";

export default function ViewButton({
  newTab,
  calendar,
  listID,
  editable,
  uid,
  classes,
}) {
  return (
    <Link
      href={`/list${!newTab ? "s" : ""}${
        calendar ? "/calendar" : ""
      }/${listID}${editable ? `/${uid}` : ""}`}
      replace={!newTab}
      passHref
    >
      <IconButton
        id={calendar && !newTab ? "calendar" : undefined}
        aria-label={calendar ? "calendar view" : "list view"}
        title={calendar ? "Calendar view" : "List view"}
        className={classes.button}
      >
        {calendar ? (
          <TodayRoundedIcon className={classes.topIcon} />
        ) : (
          <FormatListBulletedRoundedIcon className={classes.topIcon} />
        )}
      </IconButton>
    </Link>
  );
}
