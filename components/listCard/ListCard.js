import { useState } from "react";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import ListDetails from "./ListDetails";

const useStyles = makeStyles((theme) => ({
  list: {
    position: "relative",
    display: "inline-flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "flex-start",
    width: "200px",
    height: "300px",
    overflow: "hidden",
    borderRadius: "10px",
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
  },
}));

export default function ListCard({ list, index, setMessage }) {
  const classes = useStyles();
  const [data, setData] = useState(undefined);
  const show = index.toString() === data;
  const touch = useMediaQuery("(hover: none)");

  const handleShowDetails = (ev) => {
    const index =
      ev?.target?.parentElement?.parentElement?.dataset?.index ||
      ev?.target?.dataset?.index;
    setTimeout(
      () => {
        setData(index);
      },
      touch ? 250 : 0
    );
  };

  return (
    <ClickAwayListener onClickAway={() => setData(undefined)}>
      <div
        className={classes.list}
        onMouseEnter={!touch && !show ? handleShowDetails : undefined}
        onTouchStart={touch && !show ? handleShowDetails : undefined}
        data-index={index}
      >
        {list.movies?.length > 0
          ? list.movies
              .sort((a, b) => a.position - b.position)
              .slice(0, 4)
              .map((movie, index) => {
                return (
                  <Image
                    key={`M-${index}`}
                    width={100}
                    height={150}
                    objectFit={movie?.poster_path ? "cover" : "contain"}
                    src={
                      movie?.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie?.poster_path}`
                        : "/movieIcon.png"
                    }
                    onError={(ev) => {
                      ev.target.onerror = null;
                      ev.target.src = "/movieIcon.png";
                    }}
                    alt=""
                  />
                );
              })
          : [...Array(3)].map((el, index) => {
              return (
                <Image
                  key={index}
                  width={200}
                  height={100}
                  objectFit="cover"
                  src="/popcorn.png"
                  onError={(ev) => {
                    ev.target.onerror = null;
                    ev.target.src = "/movieIcon.png";
                  }}
                  alt=""
                />
              );
            })}
        <ListDetails
          listID={list._id}
          title={list.title}
          creator={list.user}
          movies={list.movies
            .sort((a, b) => a.position - b.position)
            .map((movie) => {
              return {
                title: movie.title,
                poster_path: movie.poster_path,
                position: movie.position,
              };
            })}
          show={show}
          handleShowDetails={handleShowDetails}
          setMessage={setMessage}
        />
      </div>
    </ClickAwayListener>
  );
}
