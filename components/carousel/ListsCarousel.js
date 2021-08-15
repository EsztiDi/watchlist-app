import React from "react";
import Link from "next/link";
import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Carousel from "react-material-ui-carousel";

import ListDetails from "./ListDetails";

const useStyles = makeStyles((theme) => ({
  listsCard: {
    minWidth: "900px",
    minHeight: "410px",
    margin: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    padding: theme.spacing(2),
    textAlign: "center",
    "& > :first-child": {
      marginBottom: theme.spacing(1),
    },
    "& > :nth-child(2)": {
      marginBottom: theme.spacing(2.5),
    },
    "& .CarouselItem > div": {
      display: "flex",
      justifyContent: "space-evenly",
    },
  },
  list: {
    position: "relative",
    display: "inline-flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "flex-start",
    borderRadius: "10px",
    overflow: "hidden",
    width: "200px",
    "&:not(:last-child)": {
      marginRight: `${theme.spacing(2)}px !important`,
    },
  },
}));

export default function ListsCarousel({ lists }) {
  const classes = useStyles();
  const [data, setData] = React.useState("");

  const handleShowDetails = (ev) => {
    const index =
      ev?.target?.parentElement?.parentElement?.dataset?.index ||
      ev?.target?.dataset?.index;
    setData(index);
  };

  var sliced = [];
  for (var i = 0; i < lists.length; i += 4) {
    sliced.push(lists.slice(i, i + 4));
  }

  return (
    <Paper elevation={1} className={classes.listsCard}>
      <Typography variant="h4">New Watchlists</Typography>
      <Divider />
      <Carousel
        className={classes.carousel}
        autoPlay={false}
        interval={5000}
        timeout={300}
        indicatorContainerProps={{
          style: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          },
        }}
      >
        {sliced.map((page) => {
          return page.map((list, index) => {
            return (
              <Link key={index} href={`/list/${list._id}`} passHref>
                <a
                  className={classes.list}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={handleShowDetails}
                  data-index={index}
                >
                  {list.movies.slice(0, 4).map((movie, index) => {
                    return (
                      <Image
                        key={`M-${index}`}
                        width={100}
                        height={150}
                        objectFit="contain"
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
                        className={classes.poster}
                      />
                    );
                  })}
                  <ListDetails
                    title={list.title}
                    name={list.user?.name?.split(" ")[0]}
                    movies={list.movies.map((movie) => movie.title)}
                    show={index.toString() === data}
                    handleShowDetails={handleShowDetails}
                  />
                </a>
              </Link>
            );
          });
        })}
      </Carousel>
    </Paper>
  );
}
