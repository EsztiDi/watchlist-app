import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";

const useStyles = makeStyles((theme) => ({
  login: {
    padding: theme.spacing(6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > button": {
      margin: "0.5rem 0 !important",
      display: "flex !important",
      justifyContent: "center !important",
      width: "50% !important",
      fontFamily: "inherit !important",
      "& > div > div:nth-child(2)": {
        width: "24px !important",
      },
    },
  },
  loginMobile: {
    padding: theme.spacing(2.5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > button": {
      margin: "0.5rem 0 !important",
      display: "flex !important",
      justifyContent: "center !important",
      width: "100% !important",
      fontFamily: "inherit !important",
      "& > div > div:nth-child(2)": {
        width: "24px !important",
      },
    },
  },
}));

export default function Login() {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const matches = useMediaQuery("(max-width:700px)");

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
          <Paper
            elevation={4}
            className={matches ? classes.loginMobile : classes.login}
          >
            <GoogleLoginButton onClick={() => signIn("google")} />
            <FacebookLoginButton onClick={() => signIn("facebook")} />
            <TwitterLoginButton onClick={() => signIn("twitter")} />
            <GithubLoginButton onClick={() => signIn("github")} />
          </Paper>
        </Container>
      </>
    )
  );
}
