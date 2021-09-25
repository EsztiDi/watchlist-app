import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";
import TodayRoundedIcon from "@material-ui/icons/TodayRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Form from "./Form";

const useStyles = makeStyles((theme) => ({
  containerMobile: {
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(3),
  },
  paperMobile: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
  titleContainer: {
    margin: theme.spacing(1.5),
    padding: theme.spacing(1),
    "& > h4": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > span": {
        flexGrow: 1,
      },
    },
  },
  titleContainerMobile: {
    margin: 0,
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(0.5),
    "& > h4": {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& > span": {
        flexGrow: 1,
      },
    },
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
  button: {
    padding: theme.spacing(0.5),
  },
  star: {
    fontSize: "2.1rem",
    color: theme.palette.primary.light,
    opacity: 0.75,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
  topIcon: {
    fontSize: "1.9rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
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
  const [session, loading] = useSession();
  const router = useRouter();
  var { id } = router.query;
  const matches = useMediaQuery("(max-width:1024px)");
  const matches2 = useMediaQuery("(max-width:768px)");

  var movies = (list) => list?.movies?.sort((a, b) => a.position - b.position);
  const [updating, setUpdating] = React.useState(false);
  const [backdrop, setBackdrop] = React.useState("");
  const [alert, setAlert] = React.useState("");

  const { data: list, error } = useSWR(id[0] ? `/api/lists/${id[0]}` : null, {
    refreshInterval: 2000,
    initialData: initialList, // For og metatags
  });
  const { data: savedLists, error2 } = useSWR(
    session ? "/api/lists/saved" : null
  );
  if (error) console.error(error);
  if (error2) console.error(error2);

  const sameUser = session && list?.user?.email === session?.user?.email;
  const saved = savedLists?.map((list) => list.listid).includes(id[0]);
  const contentType = "application/json";

  const uid = new Date(list?.createdAt).getTime().toString().substring(0, 12);
  const editable = id.length > 1 ? id[1] === uid : false;

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
      setMessage(error.message);
      router.push("/");
    }
    // eslint-disable-next-line
  }, [error]);

  const handleMessage = () => {
    setAlert("");
  };

  const saveList = async (list) => {
    try {
      const res = await fetch("/api/lists/saved", {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(list),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate("/api/lists/saved");
      setUpdating(false);
      setAlert("List saved!");
    } catch (error) {
      setMessage(`${error.message} - Failed to add list, please try again.`);
      setUpdating(false);
    }
  };

  const deleteList = async (list) => {
    try {
      const res = await fetch(`/api/lists/saved`, {
        method: "DELETE",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(list),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate("/api/lists/saved");
      setUpdating(false);
      setAlert("List removed");
    } catch (error) {
      setMessage(`${error.message} - Failed to delete list.`);
      setUpdating(false);
    }
  };

  const handleButtonClick = () => {
    if (!loading && !session) {
      router.push("/login");
    }
    if (session) {
      setUpdating(true);
      if (saved) {
        deleteList({ id: id[0] });
      } else {
        saveList({
          listid: id[0],
          uid: editable ? uid : "",
          title: list?.title,
          creator: { name: list?.user.name, email: list?.user.email },
          movies: list?.movies.map((movie) => {
            return {
              title: movie.title,
              poster_path: movie.poster_path,
              position: movie.position,
            };
          }),
        });
      }
    }
  };

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
        <Container
          maxWidth="md"
          className={matches ? classes.containerMobile : undefined}
        >
          {Object.keys(list).length !== 0 && backdrop.length > 0 && (
            <div className={classes.backdrop} data-background="backdrop">
              <Image layout="fill" objectFit="cover" src={backdrop} alt="" />
            </div>
          )}
          {alert && (
            <Snackbar
              open={alert.length > 0}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              autoHideDuration={3000}
              onClose={handleMessage}
            >
              <Alert
                severity="success"
                variant="standard"
                style={{
                  fontSize: "1rem",
                  alignItems: "center",
                }}
              >
                {alert}
              </Alert>
            </Snackbar>
          )}
          <Paper
            elevation={4}
            className={matches ? classes.paperMobile : classes.paper}
          >
            <Paper
              elevation={1}
              className={
                matches2 ? classes.titleContainerMobile : classes.titleContainer
              }
            >
              <Typography variant="h4">
                {sameUser !== undefined &&
                  !sameUser &&
                  (saved ? (
                    <IconButton
                      aria-label="remove list"
                      title="Remove list"
                      disabled={updating}
                      onClick={handleButtonClick}
                      className={classes.button}
                    >
                      <StarRoundedIcon className={classes.star} />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="save list"
                      title="Save list"
                      disabled={updating}
                      onClick={handleButtonClick}
                      className={classes.button}
                    >
                      <StarBorderRoundedIcon className={classes.star} />
                    </IconButton>
                  ))}
                <span>{list.title}</span>
                {calendar ? (
                  <Link
                    href={editable ? `/list/${id[0]}/${uid}` : `/list/${id[0]}`}
                    passHref
                  >
                    <IconButton
                      aria-label="list view"
                      title="List view"
                      className={classes.button}
                    >
                      <FormatListBulletedRoundedIcon
                        className={classes.topIcon}
                      />
                    </IconButton>
                  </Link>
                ) : (
                  <Link
                    href={
                      editable
                        ? `/list/calendar/${id[0]}/${uid}`
                        : `/list/calendar/${id[0]}`
                    }
                    passHref
                  >
                    <IconButton
                      aria-label="calendar view"
                      title="Calendar view"
                      className={classes.button}
                    >
                      <TodayRoundedIcon className={classes.topIcon} />
                    </IconButton>
                  </Link>
                )}
              </Typography>
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
