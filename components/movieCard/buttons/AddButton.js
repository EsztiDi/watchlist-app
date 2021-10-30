import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import useSWR from "swr";

import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAddRoundedIcon from "@material-ui/icons/PlaylistAddRounded";

import ListsMenu from "../../carousel/ListsMenu";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: theme.spacing(0.5),
  },
  icon: {
    fontSize: "1.8rem",
    color: theme.palette.primary.light,
    "&:hover": {
      color: theme.palette.primary.main,
    },
  },
}));

export default function AddButton({ movie, updating, setMessage }) {
  const classes = useStyles();

  // For ListsMenu
  const [session, loading] = useSession();
  const router = useRouter();
  const { data: lists, error } = useSWR(session ? "/api/lists" : null);
  if (error) console.error(error);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      setMenuOpen(false);
    };
  }, [movie?.id]);

  const handleButtonClick = () => {
    if (!loading && !session) {
      router?.push("/login");
    } else if (lists && lists.length === 0) {
      setMessage("Create a list first.");
    } else {
      setMenuOpen((prevOpen) => !prevOpen);
    }
  };

  const handleMenuClose = (ev) => {
    if (anchorRef.current && anchorRef.current.contains(ev.target)) {
      return;
    }
    setMenuOpen(false);
  };

  const handleListKeyDown = (ev) => {
    if (ev.key === "Tab") {
      ev.preventDefault();
      setMenuOpen(false);
    }
  };

  return (
    <>
      <IconButton
        aria-controls={menuOpen ? "menu-list" : undefined}
        aria-haspopup="true"
        aria-label="add to list"
        title="Add to list"
        ref={anchorRef}
        disabled={updating}
        onClick={handleButtonClick}
        className={classes.button}
      >
        <PlaylistAddRoundedIcon className={classes.icon} />
      </IconButton>
      {session && (
        <ListsMenu
          menuOpen={menuOpen}
          anchorEl={anchorRef.current}
          handleMenuClose={handleMenuClose}
          handleListKeyDown={handleListKeyDown}
          movie={movie}
          setMessage={setMessage}
        />
      )}
    </>
  );
}
