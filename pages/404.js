import Typography from "@material-ui/core/Typography";

export default function Custom404() {
  return (
    <div style={{ textAlign: "center", paddingTop: "1rem" }}>
      <Typography variant="h5">404 - Not Found</Typography>
      <Typography variant="h6">
        We're sorry, this page can't be found.
      </Typography>
      <img
        src="/puppy2.jpg"
        alt="Error 404"
        style={{ maxWidth: "60%", paddingTop: "1rem" }}
      />
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
