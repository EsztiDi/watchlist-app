import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";

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
  button: {
    margin: "0.5rem 0 !important",
    display: "flex !important",
    justifyContent: "center !important",
    width: "50% !important",
    fontFamily: "inherit !important",
    "& > div > div:nth-child(2)": {
      width: "24px !important",
    },
  },
}));

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
      <>
        <Head>
          <title>Login - My Watchlists</title>
        </Head>
        <Container maxWidth="md">
          <Paper elevation={4} className={classes.paper}>
            <GoogleLoginButton
              className={classes.button}
              onClick={() => signIn("google")}
            />
            <FacebookLoginButton
              className={classes.button}
              onClick={() => signIn("facebook")}
            />
            <LinkedInLoginButton
              className={classes.button}
              onClick={() => signIn("linkedin")}
            />
            <TwitterLoginButton
              className={classes.button}
              onClick={() => signIn("twitter")}
            />
            <GithubLoginButton
              className={classes.button}
              onClick={() => signIn("github")}
            />
          </Paper>
        </Container>
      </>
    )
  );
}
