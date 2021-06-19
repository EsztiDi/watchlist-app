import TableRow from "@material-ui/core/TableRow";
import Day from "./Day";

export default function Week({ rows }) {
  return (
    rows &&
    rows.map((row, index) => {
      return (
        <TableRow key={`W${index}`}>
          {row.map((date, index) => {
            return (
              <Day key={`D${index}`} date={date.date} movies={date.movies} />
            );
          })}
        </TableRow>
      );
    })
  );
}
