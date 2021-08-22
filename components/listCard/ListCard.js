import Image from "next/image";

import { makeStyles } from "@material-ui/core/styles";

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
    "&:not(:last-child)": {
      marginRight: `${theme.spacing(2)}px !important`,
    },
  },
}));

export default function ListCard({
  list,
  index,
  updating,
  setUpdating,
  setMessage,
}) {
  const classes = useStyles();
  const [data, setData] = React.useState("");

  const handleShowDetails = (ev) => {
    const index =
      ev?.target?.parentElement?.parentElement?.dataset?.index ||
      ev?.target?.dataset?.index;
    setData(index);
  };

  return (
    <div
      className={classes.list}
      onMouseEnter={handleShowDetails}
      data-index={index}
    >
      {list.movies
        .sort((a, b) => a.position - b.position)
        .slice(0, 4)
        .map((movie, index) => {
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
            />
          );
        })}
      <ListDetails
        listID={list.listid ? list.listid : list._id}
        title={list.title}
        creator={
          list.creator
            ? list.creator
            : { name: list.user.name, email: list.user.email }
        }
        movies={list.movies.map((movie) => {
          return {
            title: movie.title,
            poster_path: movie.poster_path,
            position: movie.position,
          };
        })}
        show={index.toString() === data}
        handleShowDetails={handleShowDetails}
        updating={updating}
        setUpdating={setUpdating}
        setMessage={setMessage}
      />
    </div>
  );
}
