import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/client";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";

const useStyles = makeStyles((theme) => ({
  navbar: {
    flexGrow: 1,
    minHeight: 72,
  },
  toolbar: {
    minHeight: 72,
  },
  title: {
    marginRight: "auto",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    userSelect: "none",
    "& h5": {
      color: theme.palette.text.primary,
      marginLeft: theme.spacing(2),
      letterSpacing: "0.02857em",
      textTransform: "uppercase",
    },
  },
  menu: {
    marginLeft: theme.spacing(2),
    padding: 0,
  },
  avatar: {
    borderRadius: "50%",
  },
  menuItem: {
    width: "100%",
    textAlign: "center",
    fontSize: "15px",
  },
}));

export default function Navbar() {
  const classes = useStyles();

  const [session, loading] = useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
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

    if (ev.key === "Enter") {
      document.activeElement.click();
    }
  };

  // Return focus to button when menu is closed
  const prevOpen = React.useRef(menuOpen);
  React.useEffect(() => {
    if (prevOpen.current === true && menuOpen === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = menuOpen;
  }, [menuOpen]);

  return (
    <div className={classes.navbar}>
      <AppBar color="default" position="fixed">
        <Toolbar className={classes.toolbar}>
          <Link href="/lists">
            <a className={classes.title}>
              <Image src="/logo.png" alt="Logo" width={56} height={56} />
              <Typography variant="h5">My Watchlists</Typography>
            </a>
          </Link>
          <Link href="/">
            <a>
              <Button size="large">Discover</Button>
            </a>
          </Link>
          {user ? (
            <>
              <Link href="/create">
                <a>
                  <Button size="large">Create</Button>
                </a>
              </Link>
              <Link href="/lists">
                <a>
                  <Button size="large">Lists</Button>
                </a>
              </Link>
              <IconButton
                size="medium"
                className={classes.menu}
                ref={anchorRef}
                aria-controls={menuOpen ? "menu-list" : undefined}
                aria-haspopup="true"
                onClick={handleMenuToggle}
              >
                <Image
                  src={user.image ? user.image : "/avatar.jpg"}
                  alt=""
                  width={48}
                  height={48}
                  className={classes.avatar}
                />
              </IconButton>
              <Popper
                open={menuOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleMenuClose}>
                        <MenuList
                          autoFocus={menuOpen}
                          id="menu-list"
                          onKeyDown={handleListKeyDown}
                        >
                          <Link href="/account" passHref>
                            <MenuItem onClick={handleMenuClose}>
                              <Typography
                                variant="button"
                                className={classes.menuItem}
                              >
                                Account
                              </Typography>
                            </MenuItem>
                          </Link>
                          <MenuItem onClick={() => signOut()}>
                            <Typography
                              variant="button"
                              className={classes.menuItem}
                            >
                              Log out
                            </Typography>
                          </MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </>
          ) : (
            <Link href="/login">
              <a>
                <Button size="large">Login</Button>
              </a>
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.toolbar} />
    </div>
  );
}
