import { useState, useEffect, useRef } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  hidden: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    position: "relative",
    fontWeight: "normal",
  },
  more: {
    position: "absolute",
    right: 0,
    padding: "3px",
    backgroundColor: "#fff",
    boxShadow: "none",
    minWidth: 0,
    fontWeight: "normal",
    lineHeight: 1.6,
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  less: {
    padding: "3px",
    backgroundColor: "#fff",
    boxShadow: "none",
    minWidth: "45px",
    lineHeight: 1.4,
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
}));

export default function Cast({
  variant,
  media_type,
  creators,
  directors,
  cast,
  id,
  listID,
}) {
  const classes = useStyles();
  const matches2 = useMediaQuery("(max-width:500px)");
  const [overflows, setOverflows] = useState(false);
  const [visible, setVisible] = useState(false);
  const isMounted = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (visible) handleLess();
    // eslint-disable-next-line
  }, [id, listID]);

  useEffect(() => {
    var list = document.getElementById(`${id}-${variant}`);
    if (isMounted.current) setOverflows(list.offsetWidth < list.scrollWidth);
  }, [id, listID, variant, matches2]);

  const handleMore = () => {
    setOverflows(false);
    setVisible(true);
    var list = document.getElementById(`${id}-${variant}`);
    list.style.whiteSpace = "break-spaces";
  };
  const handleLess = () => {
    setOverflows(true);
    setVisible(false);
    var list = document.getElementById(`${id}-${variant}`);
    if (list) list.style.whiteSpace = "nowrap";
  };
  return (
    <Typography
      id={`${id}-${variant}`}
      className={classes.hidden}
      style={matches2 ? { fontSize: "0.8rem" } : { fontSize: "0.95rem" }}
    >
      {variant === "cast" ? (
        <>
          <b>Cast: </b>
          {cast || "-"}
        </>
      ) : (
        <>
          {media_type === "tv" ? <b>Created by: </b> : <b>Director: </b>}
          {creators || directors || "-"}
        </>
      )}

      {overflows && (
        <Button
          size="small"
          className={classes.more}
          style={matches2 ? { fontSize: "0.6rem" } : { fontSize: "0.7rem" }}
          onClick={handleMore}
        >
          ...More
        </Button>
      )}
      {visible && (
        <span
          style={{ display: "block", textAlign: "right", marginTop: "-6px" }}
        >
          <Button
            size="small"
            className={classes.less}
            style={matches2 ? { fontSize: "0.7rem" } : { fontSize: "0.8rem" }}
            onClick={handleLess}
          >
            Less
          </Button>
        </span>
      )}
    </Typography>
  );
}
