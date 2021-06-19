import { useRouter } from "next/router";
import useSWR from "swr";
import dbConnect from "../../../utils/dbConnect";
import Watchlist from "../../../models/Watchlist";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Form from "../../../components/Form";

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
    top: "72px",
    left: "0",
    zIndex: "-99",
    minWidth: "100vw",
    minHeight: "100vh",
    opacity: "0.2",
  },
}));

export default function ListPage({ initialList, setMessage }) {
  const classes = useStyles();
  const router = useRouter();
  const { id } = router.query;
  var movies = (list) => list?.movies.sort((a, b) => a.position - b.position);

  const { data: list, error } = useSWR(id ? `/api/lists/${id[0]}` : null, {
    initialData: initialList,
  });

  if (error) setMessage(`${error.message} - Please try again or contact ...`);

  if (!list) return <CircularProgress size="3rem" thickness={3} />;

  const [backdrop, setBackdrop] = React.useState("");

  React.useEffect(() => {
    setBackdrop(
      list?.movies && list.movies.length > 0 && movies(list)[0].backdrop_path
        ? `https://image.tmdb.org/t/p/w1280${movies(list)[0].backdrop_path}`
        : ""
    );
  }, [list]);

  //   React.useEffect(() => {
  //     // For Facebook sharing
  //     const updateMeta = () => {
  //       document.querySelector("[property='og:url']").content =
  //         window.location.href;
  //       document.querySelector("[property='og:title']").content = title;
  //       document.querySelector("[property='og:description']").content = "";
  //       document.querySelector("[property='og:image']").content =
  //         movies && movies.length > 0
  //           ? "https://image.tmdb.org/t/p/w1280" + movies[0].backdrop_path
  //           : "http://localhost:3000/android-chrome-256x256.png";
  //     };
  //     updateMeta();
  //   }, [movies, title]);

  return (
    list && (
      <>
        <Container maxWidth="md">
          {Object.keys(list).length !== 0 && (
            <img
              src={backdrop}
              alt=""
              className={classes.backdrop}
              data-background="backdrop"
            />
          )}
          <Paper elevation={4} className={classes.paper}>
            <Paper elevation={1} className={classes.titleContainer}>
              <Typography variant="h5" className={classes.title}>
                {list.title}
              </Typography>
            </Paper>
            <Form
              list={list}
              setMessage={setMessage}
              newList={false}
              newTab={true}
            />
          </Paper>
        </Container>
      </>
    )
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  await dbConnect();

  var initialList = null;

  if (id) {
    try {
      var result = await Watchlist.findById(id[0]);
    } catch (error) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }
    initialList = await JSON.parse(JSON.stringify(result));
  }

  return { props: { initialList } };
}
