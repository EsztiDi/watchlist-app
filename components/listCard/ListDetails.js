import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  },
  title: {
    cursor: "pointer",
    transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.light,
    },
  },
  movies: {
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
  button: {
    margin: `auto 0 ${theme.spacing(1)}px`,
    fontWeight: "bold",
  },
  name: {
    fontStyle: "italic",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "8px",
  },
  avatar: {
    borderRadius: "50%",
  },
}));

export default function ListDetails({
  listID,
  title,
  creator,
  movies,
  show,
  handleShowDetails,
  setMessage,
}) {
  const classes = useStyles();
  const contentType = "application/json";

  const [updating, setUpdating] = useState(false);
  const [session, loading] = useSession();
  const router = useRouter();

  const { data: lists, error } = useSWR(session ? "/api/lists/saved" : null);
  if (error) console.error(error);

  const sameUser = session && creator?.email === session?.user?.email;
  const saved = lists?.map((list) => list.listid)?.includes(listID);

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

      mutate("/api/lists/saved", (lists) => {
        return [...lists, list];
      });
      setTimeout(() => {
        setUpdating(false);
      }, 500);
    } catch (error) {
      setMessage(`${error.message} - Failed to add list, please try again.`);
      setUpdating(false);
    }
  };

  const deleteList = async (id) => {
    try {
      const res = await fetch(`/api/lists/saved/${id}`, {
        method: "DELETE",
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
      router?.push("/login");
    }
    if (session) {
      setUpdating(true);
      if (saved) {
        deleteList(listID);
      } else {
        saveList({
          listid: listID,
          title,
          creator,
          emails: false,
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
      <Link href={`/list/${listID}`} passHref>
        <a>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        </a>
      </Link>
      <Typography variant="subtitle1" className={classes.name}>
        By {creator?.name || "Nameless"}
        {creator?.image && (
          <Image
            src={creator?.image}
            alt=""
            width={32}
            height={32}
            className={classes.avatar}
          />
        )}
      </Typography>
      <ul className={classes.movies}>
        {movies?.map((movie, index) => {
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
          className={classes.button}
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
