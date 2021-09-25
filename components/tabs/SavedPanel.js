import { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import DeleteForeverRoundedIcon from "@material-ui/icons/DeleteForeverRounded";

import ListCard from "../listCard/ListCard";

const useStyles = makeStyles((theme) => ({
  panel: {
    textAlign: "center",
    width: "100%",
    height: "100%",
    overflow: "auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    rowGap: theme.spacing(2),
    columnGap: theme.spacing(2),
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
  button: {
    flexBasis: "100%",
    alignSelf: "flex-end",
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
  const [loading, setLoading] = React.useState(false);

  const deleteLists = async () => {
    setUpdating(true);
    setLoading(true);
    try {
      const res = await fetch("/api/lists/saved", {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate("/api/lists/saved");
      setUpdating(false);
      setLoading(false);
    } catch (error) {
      setMessage(`${error.message} - Failed to delete lists.`);
      setUpdating(false);
      setLoading(false);
    }
  };

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
      <div className={classes.button}>
        <Button
          variant="contained"
          color="secondary"
          disableFocusRipple
          disabled={loading}
          onClick={deleteLists}
        >
          {loading ? (
            <CircularProgress size="1.5rem" thickness={5} />
          ) : (
            <>
              <DeleteForeverRoundedIcon />
              &nbsp;Remove all
            </>
          )}
        </Button>
      </div>
    </Box>
  );
}
