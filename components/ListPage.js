import { useRouter } from "next/router";
import useSWR from "swr";
import Head from "next/head";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Calendar from "./calendar/Calendar";
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
  title: {
    textAlign: "center",
    fontSize: "1.8rem",
  },
  backdrop: {
    position: "fixed",
    zIndex: "-99",
    opacity: "0.2",
    top: "72px",
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
  id = calendar ? id : id[0];

  const [backdrop, setBackdrop] = React.useState("");
  var movies = (list) => list?.movies.sort((a, b) => a.position - b.position);

  const { data: list, error } = useSWR(id ? `/api/lists/${id}` : null, {
    refreshInterval: 1000,
    initialData: initialList,
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

  if (error) setMessage(`${error.message} - Please try again or contact ...`);

  if (!list) return <CircularProgress size="3rem" thickness={3} />;

  return (
    list && (
      <>
        <Head>
          <meta property="og:title" content={list.title} />
          <meta property="og:description" content="Look what I have created!" />
          <meta property="og:url" content={url} />
          <meta property="og:image" content={image?.url} />
          <meta property="og:image:width" content={image?.width} />
          <meta property="og:image:height" content={image?.height} />
          <meta property="og:type" content="website" />
          <meta property="fb:app_id" content="827802261304460" />
          <meta name="twitter:card" content="summary_large_image" />
          <link rel="canonical" href={url} />
          <title>{list.title}</title>
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
              <Typography variant="h5" className={classes.title}>
                {list.title}
              </Typography>
            </Paper>
            {calendar ? (
              <Calendar movies={list.movies} newTab={true} />
            ) : (
              <Form
                list={list}
                setMessage={setMessage}
                newList={false}
                newTab={true}
              />
            )}
          </Paper>
        </Container>
      </>
    )
  );
}
