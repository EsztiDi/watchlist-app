import { signIn } from "next-auth/client";

import {
  FacebookLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import Container from "@material-ui/core/Container";

const classes = {
  message: {
    position: "fixed",
    top: "58px",
    zIndex: "9999",
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
};

export default function Login() {
  return (
    <Container maxWidth="xs">
      <GoogleLoginButton
        style={classes.button}
        onClick={() => signIn("google")}
      />
      <FacebookLoginButton
        style={classes.button}
        onClick={() => signIn("facebook")}
      />
      <LinkedInLoginButton
        style={classes.button}
        onClick={() => signIn("linkedin")}
      />
      <TwitterLoginButton
        style={classes.button}
        onClick={() => signIn("twitter")}
      />
      <GithubLoginButton
        style={classes.button}
        onClick={() => signIn("github")}
      />
    </Container>
  );
}
