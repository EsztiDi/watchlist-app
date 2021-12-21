import Head from "next/head";
import ListPanels from "../../components/ListPanels";

export default function ListPanel({ setMessage }) {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/intro.js/4.2.2/introjs.min.css"
        />
      </Head>
      <ListPanels setMessage={setMessage} />
    </>
  );
}
