import Head from "next/head";
import dbConnect from "../utils/dbConnect";
import Watchlist from "../models/Watchlist";
import { getSession } from "next-auth/client";

export default function Index({ watchlists }) {
  return (
    <>
      <Head>
        <meta property="og:url" content={process.env.BASE_URL} />
        <meta property="og:title" content="Watchlist App" />
        <meta
          property="og:description"
          content="An app to create watchlists for films and tv shows"
        />
        <meta
          property="og:image"
          content={`${process.env.BASE_URL}android-chrome-256x256.png`}
        />
        <meta property="fb:app_id" content="827802261304460" />
      </Head>

      {watchlists.map((list) => (
        <div key={list._id}>
          <div>
            {list.title} - {list.position}
          </div>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  await dbConnect();

  const results = await Watchlist.find({ user: session.user }).sort({
    position: 1,
  });
  const watchlists = await JSON.parse(JSON.stringify(results));

  return { props: { watchlists } };
}
