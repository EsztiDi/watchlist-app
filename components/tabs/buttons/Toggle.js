import { makeStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Tooltip from "@material-ui/core/Tooltip";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  label: {
    width: "48%",
    whiteSpace: "nowrap",
    "& *": {
      fontSize: "0.95rem",
    },
  },
  tooltip: {
    fontSize: "0.85rem",
    textAlign: "center",
    lineHeight: 1.3,
    margin: theme.spacing(0.6),
  },
  tooltipPadding: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    margin: `${theme.spacing(2.5)}px 0 ${theme.spacing(1)}px`,
  },
  miniIcon: {
    fontSize: "1rem!important",
    color: theme.palette.text.hint,
    marginLeft: theme.spacing(0.25),
  },
}));

export default function Toggle({
  privateToggle,
  privateList,
  emails,
  onChange,
}) {
  const classes = useStyles();
  const matches2 = useMediaQuery("(max-width:768px)");

  return (
    <span className={matches2 ? classes.label : undefined}>
      <FormControlLabel
        id={privateToggle ? "private" : "emails"}
        label={
          <>
            <span>{privateToggle ? "Private" : "Emails"}</span>
            <Tooltip
              arrow
              enterDelay={400}
              enterNextDelay={400}
              enterTouchDelay={50}
              leaveTouchDelay={5000}
              classes={{
                tooltip: classes.tooltipPadding,
              }}
              title={
                <p className={classes.tooltip}>
                  {privateToggle
                    ? `Private lists are NOT featured on the Discover page
                  but can still be shared by you`
                    : `Include this list in the weekly releases summary email
                  on Thursdays`}
                </p>
              }
            >
              <HelpOutlineRoundedIcon
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className={classes.miniIcon}
              />
            </Tooltip>
          </>
        }
        labelPlacement={!matches2 ? "start" : "end"}
        control={
          <Switch
            color="primary"
            name={privateToggle ? "private" : "emails"}
            checked={privateToggle ? privateList : emails}
            onChange={onChange}
          />
        }
      />
    </span>
  );
}
