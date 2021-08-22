import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

import ListCard from "../listCard/ListCard";

const useStyles = makeStyles((theme) => ({
  panel: {
    textAlign: "center",
    width: "100%",
    overflow: "auto",
    display: "flex",
    flexWrap: "wrap",
    alignContent: "flex-start",
    justifyContent: "space-evenly",
    "& > div:not(:last-child)": {
      marginBottom: theme.spacing(2),
    },
    "&::-webkit-scrollbar": {
      width: "7px",
      height: "7px",
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
}));

export default function SavedPanel({
  lists,
  updating,
  setUpdating,
  setMessage,
  ...other
}) {
  const classes = useStyles();

  return (
    <Box
      p={2}
      className={classes.panel}
      role="tabpanel"
      id="tabpanel-saved"
      aria-labelledby="tab-saved"
      {...other}
    >
      {lists.map((list, index) => {
        return (
          <ListCard
            key={index}
            list={list}
            index={index}
            updating={updating}
            setUpdating={setUpdating}
            setMessage={setMessage}
          />
        );
      })}
    </Box>
  );
}
