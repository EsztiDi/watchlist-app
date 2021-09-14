import useSWR from "swr";
import Skeleton from "@material-ui/lab/Skeleton";
import Week from "./Week";

export default function Month({ listID, year, month }) {
  const [loc, setLoc] = React.useState("US");

  React.useEffect(() => {
    var isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;

    const getLocale = async () => {
      await fetch(`${process.env.BASE_URL}/api/account/locale`, { signal })
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
    listID ? `/api/lists/calendar/${listID}/${year}/${month}/${loc}` : null,
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
