import Head from "next/head";
import Image from "next/image";

import Typography from "@material-ui/core/Typography";

export default function Custom500() {
  return (
    <>
      <Head>
        <title>Error - My Watchlists</title>
      </Head>
      <div style={{ textAlign: "center", paddingTop: "1rem" }}>
        <Typography variant="h4">Server Error</Typography>
        <Typography variant="h6" style={{ paddingBottom: "1rem" }}>
          We&apos;re sorry, something went wrong. Please try again or contact
          thewatchlistapp@gmail.com
        </Typography>
        <Image src="/puppy1.jpg" alt="" width={360} height={480} />
        <br />
        <a
          href="https://www.pexels.com/photo/adult-black-pug-1851164/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.7rem" }}
        >
          Photo by Charles from Pexels
        </a>
      </div>
    </>
  );
}
