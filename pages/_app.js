import Head from "next/head";
import { useRouter } from "next/router";
import { Provider } from "next-auth/client";
import { SWRConfig } from "swr";

import { makeStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Fade from "@material-ui/core/Fade";
import Alert from "@material-ui/lab/Alert";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const theme = createTheme({
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
  typography: {
    h4: {
      fontFamily: "'Bangers', cursive",
      letterSpacing: "1px",
      textAlign: "center",
      cursor: "default",
      userSelect: "none",
    },
    h6: {
      cursor: "default",
    },
    body2: {
      cursor: "default",
    },
    subtitle1: {
      cursor: "default",
    },
    subtitle2: {
      cursor: "default",
    },
    caption: {
      cursor: "default",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "html, body, #__next": {
          height: "100%",
        },
        a: {
          textDecoration: "none",
          color: "inherit",
        },
        img: {
          userSelect: "none",
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
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  mainContainerMobile: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(0.5)}px ${theme.spacing(
      1
    )}px`,
  },
  message: {
    position: "fixed",
    zIndex: "9999",
    top: "29px",
    left: "50%",
    transform: "translateX(-50%)",
    minWidth: "fit-content",
    fontSize: "1rem",
  },
}));

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  url: process.env.BASE_URL,
  logo: `${process.env.BASE_URL}/android-chrome-256x256.png`,
  name: "The Watchlist App",
  description:
    "An app to create watchlists for movies and TV shows with a 'share to edit' option",
  applicationCategory: "WebApplication",
  applicationSubCategory: "Watchlist App",
  featureList:
    "share to edit, episode tracking, weekly summary email, calendar view",
  screenshot: `${process.env.BASE_URL}/screenshot.png`,
  offers: {
    "@type": "Offer",
    price: "0",
  },
  review: {
    "@type": "Review",
    name: "The Watchlist App",
    reviewRating: {
      "@type": "Rating",
      ratingValue: "4/5",
    },
    author: {
      "@type": "Person",
      name: "Diana",
    },
    reviewBody: `A great app to plan our movie nights online and to track the tv shows we are watching. I love the weekly summary email that reminds us of upcoming releases`,
    datePublished: "2021-10-26",
  },
};

export default function MyApp({ Component, pageProps }) {
  const classes = useStyles();
  const router = useRouter();

  const [message, setMessage] = React.useState("");
  const [install, setInstall] = React.useState(false);
  const matches = useMediaQuery("(max-width:768px)");
  const touch = useMediaQuery("(hover: none)");

  React.useEffect(() => {
    // Register service worker to control making site work offline
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        // Only alert about installing if it's the first beforeinstallprompt event
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          if (registrations?.length === 0) setInstall(true);
        });
        navigator.serviceWorker.register("/sw.js").then(() => {
          console.log("Service Worker Registered");
        });
      });
    }
    // Add to home screen prompt - https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtn = document.querySelector("#install");

      if (installBtn) {
        installBtn.addEventListener("click", (e) => {
          setInstall(false);
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            console.log(
              `User response to the install prompt: ${JSON.stringify(
                choiceResult
              )}`
            );
            deferredPrompt = null;
          });
        });
      }
    });

    window.addEventListener("appinstalled", () => {
      setInstall(false);
      deferredPrompt = null;
      console.log("PWA was installed");
    });
  }, []);

  React.useEffect(() => {
    // Removing the server-side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  React.useEffect(() => {
    if (router.query.error?.includes("OAuthAccountNotLinked")) {
      setMessage(
        "Please sign in with the same account you used originally or email contact@mywatchlists.watch"
      );
    } else if (router.query.error) {
      setMessage(
        `${router.query.error} – Please try again or email contact@mywatchlists.watch`
      );
    }
  }, [router.query]);

  React.useEffect(() => {
    return () => {
      setMessage("");
    };
  }, [router.query.error]);

  const handleMessage = () => {
    setMessage("");
  };
  const handleInstall = () => {
    setInstall(false);
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
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-title" content="Watchlist App" />
        <meta name="application-name" content="Watchlist App" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="robots" content="noimageindex, nofollow" />

        <meta property="og:url" content={process.env.BASE_URL} key="url" />
        <meta property="og:title" content="The Watchlist App" key="title" />
        <meta
          property="og:description"
          content="Create, share and edit watchlists with anyone"
          key="description"
        />
        <meta
          property="og:image"
          content={`${process.env.BASE_URL}/android-chrome-256x256.png`}
          key="image"
        />
        <meta property="og:image:width" content="256" key="width" />
        <meta property="og:image:height" content="256" key="height" />
        <meta property="og:type" content="website" key="type" />
        <meta property="fb:app_id" content="827802261304460" key="app_id" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={process.env.BASE_URL} key="canonical" />
        <meta
          name="description"
          content="Create, share and edit watchlists for films and TV shows to plan movie nights or to keep track of your shows 🎬 + 🍕"
        />
        <title>My Watchlists</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>
      <Provider session={pageProps.session}>
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init)
                .then((res) => res.json())
                .then((json) => {
                  if (!json?.success) {
                    throw new Error("This list has been deleted.");
                  }
                  return json.data;
                }),
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
                      message.includes("saved!") ||
                      message.includes("deleted!") ||
                      message.includes("A sign in link has been sent")
                        ? "success"
                        : message.includes("already on the list") ||
                          message.includes("ad blocker") ||
                          message.includes("Create a list")
                        ? "warning"
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
            {install && (
              <ClickAwayListener onClickAway={handleInstall}>
                <Fade in={install}>
                  <Alert
                    id="install"
                    severity="info"
                    variant="filled"
                    className={classes.message}
                    style={{ cursor: "pointer", textAlign: "center" }}
                  >
                    {touch
                      ? "For best experience, click here to add to home screen."
                      : "Click here to add a link to your desktop."}
                  </Alert>
                </Fade>
              </ClickAwayListener>
            )}
            <Container
              className={
                matches ? classes.mainContainerMobile : classes.mainContainer
              }
              style={{
                height:
                  router.pathname.includes("/lists/[id]") ||
                  router.pathname.includes("/lists/calendar/[id]")
                    ? "auto"
                    : "calc(100% - 56px)",
              }}
            >
              <Component {...pageProps} setMessage={setMessage} />
              <Footer />
            </Container>
          </ThemeProvider>
        </SWRConfig>
      </Provider>
    </>
  );
}
