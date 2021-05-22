import Typography from "@material-ui/core/Typography";

export default function Custom500() {
  console.error("Error: 500 (Internal Server Error)");

  return (
    <div style={{ textAlign: "center", paddingTop: "1rem" }}>
      <Typography variant="h5">Server Error</Typography>
      <Typography variant="h6">
        We're sorry, something went wrong. Please try again or contact ...
      </Typography>
      <img
        src="/puppy1.jpg"
        alt="Error 500"
        style={{ maxWidth: "60%", paddingTop: "1rem" }}
      />
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
  );
}
