import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import CardHeader from "@material-ui/core/CardHeader";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Month from "./Month";
import MonthPicker from "./MonthPicker";

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
  cell: {
    padding: theme.spacing(1),
  },
}));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const today = new Date();

export default function Calendar({ listID, loc, newTab = false }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:768px)");

  var [year, setYear] = useState(today.getFullYear());
  var [month, setMonth] = useState(today.getMonth());

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
                  <MonthPicker
                    month={month}
                    year={year}
                    setMonth={setMonth}
                    setYear={setYear}
                  />
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
