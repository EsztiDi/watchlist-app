import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  details: {
    borderRadius: "10px",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    background: "rgba(0,0,0,0.7)",
    transition: "0.2s",
    padding: theme.spacing(1.5),
    color: "#fff",
    "& > :nth-child(1)": {
      cursor: "pointer",
    },
    "& > :nth-child(2)": {
      fontStyle: "italic",
      cursor: "pointer",
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
      <Typography variant="h6">{title}</Typography>
      <Typography variant="subtitle1">By {name}</Typography>
      <ul>
        {movies.map((movie, index) => {
          return <li key={index}>{movie}</li>;
        })}
      </ul>
    </div>
  );
}
