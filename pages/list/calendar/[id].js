import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

import ListPage from "../../../components/ListPage";

export default function ListPageCalendar({ initialList, setMessage }) {
  return (
    <ListPage
      initialList={initialList}
      setMessage={setMessage}
      calendar={true}
    />
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  await dbConnect();

  var initialList = null;

  if (id) {
    try {
      var result = await Watchlist.findById(id);
    } catch (error) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    initialList = await JSON.parse(JSON.stringify(result));
  }

  return { props: { initialList } };
}
