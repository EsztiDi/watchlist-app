import useSWR from "swr";
import Skeleton from "@material-ui/lab/Skeleton";
import Week from "./Week";

export default function Month({ listID, year, month }) {
  const { data: dates, error } = useSWR(
    listID ? `/api/lists/calendar/${listID}/${year}/${month}` : null,
    {
      refreshInterval: 2000,
    }
  );
  if (error) console.error(error);

  if (!dates)
    return (
      <tr>
        <td scope="col" colSpan={7}>
          <Skeleton
            variant="rect"
            width={"100%"}
            height={36}
            style={{ marginTop: "2px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={36}
            style={{ marginTop: "2px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={36}
            style={{ marginTop: "2px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={36}
            style={{ marginTop: "2px" }}
          />
          <Skeleton
            variant="rect"
            width={"100%"}
            height={36}
            style={{ marginTop: "2px" }}
          />
        </td>
      </tr>
    );

  return <Week rows={dates} month={month} year={year} />;
}
