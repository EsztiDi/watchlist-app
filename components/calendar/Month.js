import useSWR from "swr";
import Week from "./Week";

export default function Month({ listID, year, month }) {
  const [loc, setLoc] = React.useState("");

  React.useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const getLocale = async () => {
      await fetch(`/api/account/locale`, { signal })
        .then((res) => res.json())
        .then((res) => {
          if (isMounted) setLoc(res.data || "US");
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getLocale();

    return () => {
      controller.abort();
      isMounted = false;
    };
    // eslint-disable-next-line
  }, []);

  const { data: dates, error } = useSWR(
    listID && loc
      ? `/api/lists/calendar/${listID}/${year}/${month}/${loc}`
      : null,
    {
      refreshInterval: 2000,
    }
  );
  if (error) console.error(error);

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
