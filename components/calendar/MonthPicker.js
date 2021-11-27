import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  buttons: {
    whiteSpace: "nowrap",
    "& > *": {
      verticalAlign: "middle",
    },
  },
  thisMonth: {
    position: "absolute",
    right: "16px",
  },
  thisMonthMobile: {
    whiteSpace: "nowrap",
    marginLeft: theme.spacing(1),
  },
  button: {
    padding: theme.spacing(0.5),
  },
  arrow: {
    fontSize: "1.6rem",
    color: theme.palette.primary.light,
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  picker: {
    "& input": {
      cursor: "pointer",
      textAlign: "center",
      fontWeight: "500",
      padding: theme.spacing(1),
    },
    "& > *": {
      width: "80%",
      margin: "auto",
    },
  },
}));

const today = new Date();

export default function MonthPicker({
  month,
  year,
  setMonth,
  setYear,
  carousel,
}) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");

  const thisMonth = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const nextMonth = () => {
    const currentYear = month === 11 ? year + 1 : year;
    const currentMonth = month === 11 ? (month = 0) : month + 1;

    setYear(currentYear);
    setMonth(currentMonth);
  };

  const previousMonth = () => {
    const currentYear = month === 0 ? year - 1 : year;
    const currentMonth = month === 0 ? 11 : month - 1;

    setYear(currentYear);
    setMonth(currentMonth);
  };

  const handleDateChange = (date) => {
    setYear(date._d.getFullYear());
    setMonth(date._d.getMonth());
  };

  return (
    <>
      <span className={classes.buttons}>
        <IconButton
          aria-label="previous month"
          title="Prev"
          onClick={previousMonth}
          className={classes.button}
        >
          <ArrowBackIosRoundedIcon className={classes.arrow} />
        </IconButton>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            variant="inline"
            inputVariant="outlined"
            format="MMM yyyy"
            openTo="month"
            views={["year", "month"]}
            autoFocus={false}
            autoOk
            id="month-picker"
            minDate={new Date(1870, 0, 1)}
            maxDate={new Date(today.getFullYear() + 10, 11, 31)}
            value={new Date(year, month)}
            onChange={handleDateChange}
            className={classes.picker}
          />
        </MuiPickersUtilsProvider>
        <IconButton
          aria-label="next month"
          title="Next"
          onClick={nextMonth}
          className={classes.button}
        >
          <ArrowForwardIosRoundedIcon className={classes.arrow} />
        </IconButton>
      </span>
      {!carousel && (
        <Button
          aria-label="this month"
          onClick={thisMonth}
          className={matches ? classes.thisMonthMobile : classes.thisMonth}
        >
          This month
        </Button>
      )}
    </>
  );
}
