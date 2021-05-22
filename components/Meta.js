import Head from "next/head";

export default function Meta() {
  return (
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <meta name="theme-color" content="#ffffff" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      {/* For Fb sharing - change before production! */}
      <meta property="og:url" content="http://localhost:3000/" />
      <meta property="og:title" content="Watchlist App" />
      <meta
        property="og:description"
        content="An app to create watchlists for films and tv shows"
      />
      <meta
        property="og:image"
        content="http://localhost:3000/android-chrome-256x256.png"
      />
      <meta property="fb:app_id" content="827802261304460" />

      <title>Watchlists</title>
    </Head>
  );
}
