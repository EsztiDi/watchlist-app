import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  details: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    borderRadius: "10px",
    background: "rgba(0,0,0,0.7)",
    transition: "0.2s",
    padding: theme.spacing(1.5),
    color: "#fff",
    "& > a > h6": {
      cursor: "pointer",
      transition: "color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      "&:hover": {
        color: theme.palette.primary.light,
      },
    },
    "& > :nth-child(2)": {
      fontStyle: "italic",
    },
    "& > ul": {
      fontSize: "0.95rem",
      textAlign: "left",
      paddingInlineStart: "24px",
      maxHeight: "68%",
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
  },
}));

export default function ListDetails({
  listID,
  title,
  name,
  movies,
  show,
  handleShowDetails,
}) {
  const classes = useStyles();

  const handleMouse = () => {
    handleShowDetails();
  };

  return (
    <div
      className={classes.details}
      style={!show ? { zIndex: "-99", opacity: 0 } : undefined}
      onMouseLeave={handleMouse}
    >
      <Link href={`/list/${listID}`} passHref>
        <a target="_blank" rel="noopener noreferrer">
          <Typography variant="h6">{title}</Typography>
        </a>
      </Link>
      <Typography variant="subtitle1">By {name}</Typography>
      <ul>
        {movies.map((movie, index) => {
          return <li key={index}>{movie}</li>;
        })}
      </ul>
    </div>
  );
}
