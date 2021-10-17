import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  details: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderRadius: "10px",
    background: "rgba(0,0,0,0.7)",
    transition: "0.2s",
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1.5),
    color: "#fff",
    "& > a > h6": {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
    "& > h6": {
      fontStyle: "italic",
    },
    "& > ul": {
      fontSize: "0.95rem",
      textAlign: "left",
      paddingInlineStart: "24px",
      maxHeight: "53.5%",
      overflow: "auto",
      "&::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
        background: "#F0F0F0",
        borderRadius: "100px",
      },
      "&::-webkit-scrollbar-track": {
        background: "#F0F0F0",
        borderRadius: "100px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#CECECE",
        borderRadius: "100px",
      },
    },
    "& > button": {
      margin: `auto 0 ${theme.spacing(1)}px`,
      // padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
      fontWeight: "bold",
    },
  },
  open: {
    fontSize: "1rem",
    marginLeft: theme.spacing(0.5),
  },
}));

export default function ListDetails({
  listID,
  uid,
  title,
  creator,
  movies,
  show,
  handleShowDetails,
  setMessage,
}) {
  const classes = useStyles();
  const name = creator?.name?.split(" ")[0];
  const contentType = "application/json";

  const [updating, setUpdating] = React.useState(false);
  // const [errorCheck, setError] = React.useState(false);
  const [session, loading] = useSession();
  const router = useRouter();

  const { data: lists, error } = useSWR(session ? "/api/lists/saved" : null);
  if (error) console.error(error);

  // var { data: origList, error: error2 } = useSWR(
  //   errorCheck ? null : listID ? `/api/lists/${listID}` : null
  // );
  // if (error2) {
  //   console.error(error2);
  //   setError(true);
  // }

  const sameUser = session && creator?.email === session?.user?.email;
  const saved = lists?.map((list) => list.listid).includes(listID);

  // React.useEffect(() => {
  //   if (window.location.pathname.includes("/lists/") && origList) {
  //     const updateList = async (list) => {
  //       try {
  //         const res = await fetch("/api/lists/saved", {
  //           method: "PUT",
  //           headers: {
  //             Accept: contentType,
  //             "Content-Type": contentType,
  //           },
  //           body: JSON.stringify(list),
  //         });

  //         if (!res.ok) {
  //           throw new Error(res.status);
  //         }

  //         mutate("/api/lists/saved");
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };

  //     var origMovies = origList.movies
  //       ?.sort((a, b) => a.position - b.position)
  //       .map((movie) => {
  //         return {
  //           title: movie.title,
  //           poster_path: movie.poster_path,
  //           position: movie.position,
  //         };
  //       });

  //     if (
  //       origList.title !== title ||
  //       JSON.stringify(origMovies) !== JSON.stringify(movies)
  //     ) {
  //       updateList({
  //         id: listID,
  //         list: { title: origList.title, movies: origMovies },
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line
  // }, [origList]);

  const handleMouse = () => {
    handleShowDetails();
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
      setTimeout(() => {
        setUpdating(false);
      }, 500);
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
        deleteList({ id: listID });
      } else {
        saveList({
          listid: listID,
          title,
          creator,
          emails: false,
          // movies,
        });
      }
    }
  };

  return (
    <div
      className={classes.details}
      style={!show ? { zIndex: "-99", opacity: 0 } : undefined}
      onMouseLeave={handleMouse}
    >
      <Link href={uid ? `/list/${listID}/${uid}` : `/list/${listID}`} passHref>
        <a target="_blank" rel="noopener noreferrer">
          <Typography variant="h6">
            {title} <OpenInNewRoundedIcon className={classes.open} />
          </Typography>
        </a>
      </Link>
      {/* {errorCheck && (
        <Typography
          variant="caption"
          style={{ textTransform: "uppercase", fontSize: "0.7rem" }}
        >
          (deleted)
        </Typography>
      )} */}
      <Typography variant="subtitle1">By {name || "Nameless"}</Typography>
      <ul>
        {movies.map((movie, index) => {
          return <li key={index}>{movie.title}</li>;
        })}
      </ul>
      {!sameUser && (
        <Button
          size="small"
          color={saved ? "secondary" : "primary"}
          variant="contained"
          disabled={updating}
          onClick={handleButtonClick}
        >
          {updating ? (
            <CircularProgress size="1.5rem" thickness={5} />
          ) : saved ? (
            "Remove"
          ) : (
            "Save"
          )}
        </Button>
      )}
    </div>
  );
}
