import Image from "next/image";

import Typography from "@material-ui/core/Typography";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", paddingTop: "1rem" }}>
      <Typography variant="h5">404 - Not Found</Typography>
      <Typography variant="h6" style={{ paddingBottom: "1rem" }}>
        We're sorry, this page can't be found.
      </Typography>
      <Image src="/puppy2.jpg" alt="Error 404" width={360} height={480} />
      <br />
      <a
        href="https://www.pexels.com/photo/dog-lying-on-shore-during-day-2252311/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ fontSize: "0.7rem" }}
      >
        Photo by Laura Stanley from Pexels
      </a>
    </div>
  );
}
