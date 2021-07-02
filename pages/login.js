import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));
const buttonStyle = {
  margin: "0.5rem 0",
  display: "flex",
  justifyContent: "center",
  width: "50%",
};

export default function Login() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();

  if (loading) return null;

  if (session) {
    router.replace("/lists");
  }

  return (
    !loading &&
    !session && (
      <Container maxWidth="md">
        <Paper elevation={4} className={classes.paper}>
          <GoogleLoginButton
            style={buttonStyle}
            onClick={() => signIn("google")}
          />
          <FacebookLoginButton
            style={buttonStyle}
            onClick={() => signIn("facebook")}
          />
          <LinkedInLoginButton
            style={buttonStyle}
            onClick={() => signIn("linkedin")}
          />
          <TwitterLoginButton
            style={buttonStyle}
            onClick={() => signIn("twitter")}
          />
          <GithubLoginButton
            style={buttonStyle}
            onClick={() => signIn("github")}
          />
        </Paper>
      </Container>
    )
  );
}
