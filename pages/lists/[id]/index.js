import { getSession } from "next-auth/client";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

import ListPanels from "../../../components/ListPanels";

export default function Lists({ initialList, initialLists, setMessage }) {
  return (
    <ListPanels
      initialList={initialList}
      initialLists={initialLists}
      setMessage={setMessage}
    />
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const { id } = context.params;
  await dbConnect();

  var initialList = null;
  var initialLists = null;

  if (session) {
    try {
      var result = await Watchlist.findById(id);
      var results = await Watchlist.find(
        { user: session.user },
        "_id title position"
      ).sort({
        position: 1,
      });
    } catch (error) {
      return {
        redirect: {
          destination: "/lists",
          permanent: false,
        },
      };
    }

    initialList = await JSON.parse(JSON.stringify(result));
    initialLists = await JSON.parse(JSON.stringify(results));
  }

  return { props: { initialList, initialLists } };
}
