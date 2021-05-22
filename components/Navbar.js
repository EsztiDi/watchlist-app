import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/client";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

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
  profile: {
    marginLeft: theme.spacing(2),
    padding: 0,
  },
  avatar: {
    borderRadius: "50%",
  },
}));

export default function Navbar() {
  const classes = useStyles();

  const [session, loading] = useSession();

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
            <Button size="large">Discover</Button>
          </Link>
          {session ? (
            <>
              <Link href="/create">
                <Button size="large">Create</Button>
              </Link>
              <Link href="/lists">
                <Button size="large">Lists</Button>
              </Link>
              <Button size="large" onClick={() => signOut()}>
                Logout
              </Button>
              <Link href="/">
                <IconButton size="medium" className={classes.profile}>
                  <Image
                    src={
                      session.user.image ? session.user.image : "/avatar.jpg"
                    }
                    alt=""
                    width={48}
                    height={48}
                    className={classes.avatar}
                  />
                </IconButton>
              </Link>
            </>
          ) : (
            <Button size="large" onClick={() => signIn()}>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.toolbar} />
    </div>
  );
}
