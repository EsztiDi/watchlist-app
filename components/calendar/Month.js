import useSWR from "swr";
import Week from "./Week";

export default function Month({ listID, year, month, loc }) {
  const { data: shared, error: error2 } = useSWR(
    listID ? `/api/lists/shared/${listID}` : null
  );
  const { data: dates, error } = useSWR(
    listID && loc
      ? `/api/lists/calendar/${listID}/${year}/${month}/${loc}`
      : null,
    {
      refreshInterval: shared ? 2000 : 0,
    }
  );
  if (error) console.error(error);
  if (error2) console.error(error2);

  if (!dates)
    return (
      <>
        <tr>
          <td
            scope="col"
            colSpan={7}
            style={{
              height: "37.4px",
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
            }}
          ></td>
        </tr>
        <tr>
          <td
            scope="col"
            colSpan={7}
            style={{
              height: "37.9px",
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
            }}
          ></td>
        </tr>
        <tr>
          <td
            scope="col"
            colSpan={7}
            style={{
              height: "37.9px",
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
            }}
          ></td>
        </tr>
        <tr>
          <td
            scope="col"
            colSpan={7}
            style={{
              height: "37.9px",
              borderBottom: "2px solid rgba(224, 224, 224, 1)",
            }}
          ></td>
        </tr>
        <tr>
          <td
            scope="col"
            colSpan={7}
            style={{
              height: "37.9px",
            }}
          ></td>
        </tr>
      </>
    );

  return <Week rows={dates} month={month} year={year} />;
}
