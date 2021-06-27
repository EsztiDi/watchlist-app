import Head from "next/head";
import { useRouter } from "next/router";
import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";

import { makeStyles, createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fade from "@material-ui/core/Fade";
import Alert from "@material-ui/lab/Alert";

import Navbar from "../components/Navbar";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#F8D070",
      main: "#F7C550",
      dark: "#F5B829",
    },
    secondary: {
      light: "#FFADBC",
      main: "#FF758F",
      dark: "#FF5C7A",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        a: {
          textDecoration: "none",
        },
      },
    },
  },
});

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    "& a": {
      textDecoration: "none",
    },
  },
  message: {
    position: "fixed",
    zIndex: "9999",
    top: "58px",
    left: "50%",
    transform: "translateX(-50%)",
    minWidth: "45%",
    fontSize: "1rem",
  },
}));

export default function MyApp({ Component, pageProps }) {
  const classes = useStyles();
  const router = useRouter();

  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    // Removing the server-side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    if (router.query.error === "OAuthAccountNotLinked") {
      setMessage("Please sign in with the same account you used originally.");
    } else if (router.query.error) {
      setMessage(`${router.query.error} – Please try again or contact ...`);
    }
  }, [router.query]);

  const handleMessage = () => {
    setMessage("");
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f8d070" />
        <meta name="apple-mobile-web-app-title" content="Watchlists" />
        <meta name="application-name" content="Watchlists" />
        <meta name="msapplication-TileColor" content="#ffc40d" />

        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="description"
          content="An app to create watchlists for films and tv shows"
        />
        <title>My Watchlists</title>
      </Head>
      <Provider session={pageProps.session}>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init)
                .then((res) => res.json())
                .then((json) => json.data),
          }}
        >
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Navbar />
            {message && (
              <ClickAwayListener onClickAway={handleMessage}>
                <Fade in={message.length > 0}>
                  <Alert
                    severity={
                      message.includes("saved!") || message.includes("deleted!")
                        ? "success"
                        : "error"
                    }
                    variant="filled"
                    onClose={handleMessage}
                    className={classes.message}
                  >
                    {message}
                  </Alert>
                </Fade>
              </ClickAwayListener>
            )}
            <Container className={classes.mainContainer}>
              <Component {...pageProps} setMessage={setMessage} />
            </Container>
          </ThemeProvider>
        </SWRConfig>
      </Provider>
    </>
  );
}
