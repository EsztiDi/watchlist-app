import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import CloseModalButton from "../CloseModalButton";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "date", label: "Date" },
  { id: "action", label: "Action" },
  { id: "change", label: "Change" },
  { id: "user", label: "User" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow size="small">
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  history: {
    position: "relative",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #FFF",
    borderRadius: "4px",
    boxShadow: theme.shadows[5],
    height: "80%",
  },
  title: {
    fontSize: "1.3rem",
    textAlign: "center",
    padding: `0 0 ${theme.spacing(1.5)}px`,
  },
  changes: {
    height: "calc(100% - 48px)",
    overflow: "auto",
    scrollbarWidth: "thin",
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
  date: {
    whiteSpace: "nowrap",
  },
  mark: {
    textTransform: "capitalize",
    borderRadius: "6px",
    padding: theme.spacing(0.8),
  },
  break: {
    overflowWrap: "break-word",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function History({ openHistory, handleOpenHistory, changes }) {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:1024px)");

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("date");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modal}
      open={openHistory}
      onClose={handleOpenHistory}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openHistory}>
        <div
          style={matches ? { width: "95%" } : { width: "70%" }}
          className={classes.history}
        >
          <CloseModalButton onClose={handleOpenHistory} />
          <Typography variant="h5" id="modal-title" className={classes.title}>
            Change history
          </Typography>
          <TableContainer id="modal-description" className={classes.changes}>
            <Table
              stickyHeader
              aria-labelledby="modal-title"
              aria-label="changes table"
            >
              <caption>Only the last 50 changes are saved.</caption>
              <EnhancedTableHead
                classes={{ visuallyHidden: classes.visuallyHidden }}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {stableSort(changes, getComparator(order, orderBy)).map(
                  (row, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.date}>
                          {new Date(row.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <mark
                            className={classes.mark}
                            style={{
                              backgroundColor:
                                row.action === "added"
                                  ? "#ccf6e0"
                                  : row.action === "removed"
                                  ? "#FFADBC"
                                  : "#fcefa9",
                            }}
                          >
                            {row.action}
                          </mark>
                        </TableCell>
                        <TableCell className={classes.break}>
                          {row.change}
                        </TableCell>
                        <TableCell>{row.user}</TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Fade>
    </Modal>
  );
}
