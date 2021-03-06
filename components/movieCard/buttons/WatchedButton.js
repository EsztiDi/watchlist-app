import { useState, useEffect, useRef } from "react";
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
      opacity: 0.8,
    },
  },
}));

const unloadAlert = (ev) => {
  ev.preventDefault();
  ev.returnValue = "";
};

export default function WatchedButton({
  movie,
  movieID,
  season = false,
  episode = false,
}) {
  const { id, season_number, watched } = movie;

  const classes = useStyles();
  const contentType = "application/json";
  const [updating, setUpdating] = useState(false);
  const isMounted = useRef(null);

  const router = useRouter();
  var { id: ids } = router?.query;
  var listID = Array.isArray(ids) ? ids[0] : ids;

  const { data: list, error } = useSWR(listID ? `/api/lists/${listID}` : null);
  if (error) console.error(error);

  const [session, loading] = useSession();
  const auth = session && list?.user?.email === session?.user?.email;

  var editable, createdAt;
  if (Array.isArray(ids) && list) {
    ({ createdAt } = list);
    const uid = new Date(createdAt).getTime().toString().substring(0, 12);
    editable = ids[1] === uid;
  }

  useEffect(() => {
    const beforeRouteHandler = (url) => {
      if (
        router?.pathname !== url &&
        !confirm("Changes that you made may not be saved.")
      ) {
        router?.events?.emit("routeChangeError");
        // tslint:disable-next-line: no-string-throw
        throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
      }
    };

    if (updating) {
      window.addEventListener("beforeunload", unloadAlert);
      router?.events?.on("routeChangeStart", beforeRouteHandler);
    } else {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    }
    return () => {
      window.removeEventListener("beforeunload", unloadAlert);
      router?.events?.off("routeChangeStart", beforeRouteHandler);
    };
    // eslint-disable-next-line
  }, [updating]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const setMovieWatched = async () => {
    try {
      const res = await fetch(`/api/lists/watched`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          watched: watched === "false" ? "true" : "false",
          movieID: id,
          movie,
          listID,
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      await mutate(`/api/lists/${listID}`);
      mutate(`/api/lists/changes/${listID}`);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const setSeasonWatched = async () => {
    try {
      const res = await fetch(`/api/lists/watched/season`, {
        method: "POST",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          watched: watched === "false" ? "true" : "false",
          movieID,
          season_number,
          listID,
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      await mutate(`/api/lists/${listID}`);
      mutate(`/api/lists/changes/${listID}`);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const setEpisodeWatched = async () => {
    try {
      const res = await fetch(`/api/lists/watched`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({
          watched: watched === "false" ? "true" : "false",
          movieID,
          episodeID: id,
          season_number,
          listID,
        }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      await mutate(`/api/lists/${listID}`);
      mutate(`/api/lists/changes/${listID}`);
      if (isMounted.current) setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const handleClick = () => {
    setUpdating(true);
    season
      ? setSeasonWatched()
      : episode
      ? setEpisodeWatched()
      : setMovieWatched();
  };

  if (loading) return null;

  return auth || editable ? (
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
  ) : null;
}
