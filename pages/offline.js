import Head from "next/head";
import Image from "next/image";

import Typography from "@material-ui/core/Typography";

export default function Offline() {
  return (
    <>
      <Head>
        <title>Offline - My Watchlists</title>
      </Head>
      <div style={{ textAlign: "center", paddingTop: "1rem" }}>
        <Typography variant="h4">Not available</Typography>
        <Typography variant="h6" style={{ paddingBottom: "1rem" }}>
          Come back when you&apos;re online.
        </Typography>
        <Image src="/dog_meme.jpg" alt="" width={360} height={270} />
      </div>
    </>
  );
}
