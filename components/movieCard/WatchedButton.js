import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleOutlineRoundedIcon from "@material-ui/icons/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  check: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: theme.spacing(0.25),
    "& svg": {
      color: theme.palette.primary.light,
      fontSize: "1.3rem",
      opacity: 0.75,
    },
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function WatchedButton({ movie, episode = false }) {
  const { id: movieID, watched } = movie;

  const classes = useStyles();
  const contentType = "application/json";
  const [updating, setUpdating] = React.useState(false);
  const isMounted = React.useRef(null);

  const router = useRouter();
  var { id } = router.query;
  if (Array.isArray(id)) id = id[0];

  const { data: list, error } = useSWR(id ? `/api/lists/${id}` : null);
  if (error) console.error(error);

  const [session, loading] = useSession();
  const auth = session && list?.user?.email === session?.user?.email;

  React.useEffect(() => {
    updating
      ? window.addEventListener("beforeunload", unloadAlert)
      : window.removeEventListener("beforeunload", unloadAlert);
  }, [updating]);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setMovieWatched = async () => {
    try {
      const res = await fetch(`/api/lists/watched/${id}`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          movieID,
          watched: watched === "false" ? "true" : "false",
          movie,
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      await mutate(`/api/lists/${id}`);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const setEpisodeWatched = async () => {
    try {
      const res = await fetch(`/api/lists/watched/${id}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          episodeID: movieID,
          watched: watched === "false" ? "true" : "false",
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      await mutate(`/api/lists/${id}`);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const handleClick = () => {
    setUpdating(true);
    episode ? setEpisodeWatched() : setMovieWatched();
  };

  if (loading) return null;

  return (
    auth && (
      <IconButton
        aria-label="set watched"
        title="Set watched"
        className={classes.check}
        disabled={updating}
        onClick={handleClick}
      >
        {updating ? (
          <CircularProgress size="1.3rem" thickness={5} />
        ) : watched === "true" ? (
          <CheckCircleRoundedIcon />
        ) : (
          <CheckCircleOutlineRoundedIcon />
        )}
      </IconButton>
    )
  );
}
