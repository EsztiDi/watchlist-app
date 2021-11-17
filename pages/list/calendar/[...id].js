import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

import ListPage from "../../../components/ListPage";

export default function ListPageCalendar({
  initialList,
  url,
  image,
  setMessage,
}) {
  return (
    <ListPage
      initialList={initialList}
      url={url}
      image={image}
      setMessage={setMessage}
      calendar={true}
    />
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  await dbConnect();

  var initialList = null;
  var url = `${process.env.BASE_URL}${context.req.url}`;
  var image = {
    url: `${process.env.BASE_URL}/android-chrome-256x256.png`,
    width: "256",
    height: "256",
  };
  var movies = (list) => list?.movies.sort((a, b) => b.position - a.position);

  if (id) {
    try {
      var result = await Watchlist.findById(id).catch((err) =>
        console.error(err)
      );
    } catch (error) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    initialList = await JSON.parse(JSON.stringify(result));
    if (
      initialList?.movies &&
      initialList?.movies.length > 0 &&
      movies(initialList)[0].backdrop_path
    ) {
      image = {
        url: `https://image.tmdb.org/t/p/w1280${
          movies(initialList)[0].backdrop_path
        }`,
        width: "1280",
        height: "720",
      };
    }
  }

  return { props: { initialList, url, image } };
}
