import { useRouter } from "next/router";
import Head from "next/head";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(3),
  },
  titleContainer: {
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
  },
  backdrop: {
    position: "fixed",
    zIndex: "-99",
    opacity: "0.2",
    top: "56px",
    left: "0",
    minWidth: "100vw",
    minHeight: "100vh",
  },
}));

export default function ListPage({
  initialList,
  url,
  image,
  setMessage,
  calendar = false,
}) {
  const classes = useStyles();
  const router = useRouter();

  var { id } = router.query;

  const [backdrop, setBackdrop] = React.useState("");
  var movies = (list) => list?.movies?.sort((a, b) => a.position - b.position);

  const { data: list, error } = useSWR(id[0] ? `/api/lists/${id[0]}` : null, {
    refreshInterval: 2000,
    initialData: initialList, // For og metatags
  });

  React.useEffect(() => {
    if (
      list?.movies &&
      list.movies.length > 0 &&
      movies(list)[0].backdrop_path
    ) {
      setBackdrop(
        `https://image.tmdb.org/t/p/w1280${movies(list)[0].backdrop_path}`
      );
    }
  }, [list]);

  React.useEffect(() => {
    if (error) {
      setMessage(`${JSON.stringify(error.message)} - Please try again.`);
      router.push("/");
    }
    // eslint-disable-next-line
  }, [error]);

  if (!list) return <CircularProgress size="3rem" thickness={3} />;

  return (
    (initialList || list) && (
      <>
        <Head>
          <meta property="og:url" content={url} key="url" />
          <meta
            property="og:title"
            content={list ? list.title : initialList.title}
            key="title"
          />
          <meta
            property="og:description"
            content="Look what I have created!"
            key="description"
          />
          <meta property="og:image" content={image?.url} key="image" />
          <meta property="og:image:width" content={image?.width} key="width" />
          <meta
            property="og:image:height"
            content={image?.height}
            key="height"
          />
          <meta property="og:type" content="website" key="type" />
          <meta property="fb:app_id" content="827802261304460" key="app_id" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href={url} key="canonical" />
          <title>{list ? list.title : initialList.title} - My Watchlists</title>
        </Head>
        <Container maxWidth="md">
          {Object.keys(list).length !== 0 && backdrop.length > 0 && (
            <div
              style={{
                background: `url(${backdrop}) center / cover no-repeat`,
              }}
              alt=""
              className={classes.backdrop}
              data-background="backdrop"
            ></div>
          )}
          <Paper elevation={4} className={classes.paper}>
            <Paper elevation={1} className={classes.titleContainer}>
              <Typography variant="h4">{list.title}</Typography>
            </Paper>
            <Form
              list={list ? list : initialList}
              setMessage={setMessage}
              calendar={calendar}
              newList={false}
              newTab={true}
            />
          </Paper>
        </Container>
      </>
    )
  );
}
