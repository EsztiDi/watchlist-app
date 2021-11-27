import { useState } from "react";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";

import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  FacebookLoginButton,
  GoogleLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";

import EmailLogin from "../components/EmailLogin";

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
  emailButton: {
    border: "0px",
    borderRadius: "3px",
    boxShadow: "rgb(0 0 0 / 50%) 0px 1px 2px",
    color: "white",
    cursor: "pointer",
    fontSize: "19px",
    overflow: "hidden",
    padding: "0px 10px",
    userSelect: "none",
    height: "50px",
    background: theme.palette.primary.dark,
    "& > div": {
      alignItems: "center",
      display: "flex",
      height: "100%",
    },
    "& > div > div:nth-child(3)": {
      marginLeft: "-5px",
      textAlign: "left",
      width: "100%",
    },
    "&:hover": {
      background: theme.palette.primary.main,
    },
  },
}));

export default function Login({ setMessage }) {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  const matches = useMediaQuery("(max-width:700px)");

  // For EmailLogin
  const [openEmail, setOpenEmail] = useState(false);

  const handleOpenEmail = () => {
    setOpenEmail((prev) => !prev);
  };

  if (loading) return null;

  if (session) {
    router?.replace("/lists");
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
            <button onClick={handleOpenEmail} className={classes.emailButton}>
              <div>
                <EmailRoundedIcon
                  style={{
                    fontSize: "1.7rem",
                  }}
                />
                <div></div>
                <div>Log in with email</div>
              </div>
            </button>
            <EmailLogin
              open={openEmail}
              onOpenEmail={handleOpenEmail}
              signIn={signIn}
              setMessage={setMessage}
            />
          </Paper>
        </Container>
      </>
    )
  );
}
