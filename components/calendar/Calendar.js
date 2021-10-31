import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Month from "./Month";

const useStyles = makeStyles((theme) => ({
  panel: {
    width: "100%",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "7px",
      height: "7px",
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#F0F0F0",
      borderRadius: "100px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#CECECE",
      borderRadius: "100px",
    },
  },
  newTab: {
    padding: theme.spacing(1.5),
  },
  header: {
    textAlign: "center",
    padding: theme.spacing(1),
    "& span": {
      fontSize: "1.3rem",
    },
  },
  buttons: {
    position: "relative",
    padding: theme.spacing(1),
  },
  thisMonth: {
    position: "absolute",
    right: "16px",
  },
  thisMonthMobile: {
    whiteSpace: "nowrap",
    "&:last-child": {
      marginLeft: theme.spacing(1),
    },
  },
  button: {
    padding: theme.spacing(0.5),
  },
  arrow: {
    fontSize: "1.8rem",
    color: theme.palette.primary.light,
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
  cell: {
    padding: theme.spacing(1),
  },
}));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date();

export default function Calendar({ listID, loc, newTab = false }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:780px)");

  var [year, setYear] = React.useState(today.getFullYear());
  var [month, setMonth] = React.useState(today.getMonth());

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
    <Box
      p={matches ? 0.5 : 2}
      className={!newTab ? classes.panel : classes.newTab}
    >
      <Paper elevation={1} className={classes.container}>
        {newTab && (
          <CardHeader title="Release Calendar" className={classes.header} />
        )}
        <TableContainer component={Paper}>
          <Table aria-label="calendar view">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={7}
                  className={classes.buttons}
                >
                  <span className={classes.thisMonthMobile}>
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
                  <Button
                    aria-label="this month"
                    onClick={thisMonth}
                    className={
                      matches ? classes.thisMonthMobile : classes.thisMonth
                    }
                  >
                    This month
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                {days.map((day) => {
                  return (
                    <TableCell key={day} className={classes.cell}>
                      {day}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <Month listID={listID} month={month} year={year} loc={loc} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
