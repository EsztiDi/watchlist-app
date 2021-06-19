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
import KeyboardArrowLeftRoundedIcon from "@material-ui/icons/KeyboardArrowLeftRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@material-ui/icons/ArrowForwardIosRounded";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

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
    position: "relative",
  },
  back: {
    marginBottom: theme.spacing(1),
  },
  back2: {
    position: "absolute",
    top: "-57px",
    right: "24px",
  },
  header: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
  buttons: {
    position: "relative",
    padding: theme.spacing(1),
  },
  thisMonth: {
    whiteSpace: "nowrap",
    position: "absolute",
    right: "16px",
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
// const months = ["Jan", "Feb","Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const today = new Date();

export default function Calendar({ movies, newTab = false }) {
  const classes = useStyles();

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

  const handleBack = () => {
    window.history.back();
  };

  const handleDateChange = (date) => {
    setYear(date._d.getFullYear());
    setMonth(date._d.getMonth());
  };

  return (
    <Box p={2} className={!newTab ? classes.panel : classes.newTab}>
      <Button
        aria-label="back"
        onClick={handleBack}
        className={!newTab ? classes.back : classes.back2}
      >
        <KeyboardArrowLeftRoundedIcon />
        Back
      </Button>
      <Paper elevation={1} className={classes.container}>
        <CardHeader title="Calendar" className={classes.header} />
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="calendar current month">
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  colSpan={7}
                  className={classes.buttons}
                >
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
                  <Button
                    aria-label="this month"
                    onClick={thisMonth}
                    className={classes.thisMonth}
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
              <Month month={month} year={year} movies={movies} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
