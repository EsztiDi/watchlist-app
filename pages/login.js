import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import {
  FacebookLoginButton,
  GoogleLoginButton,
  LinkedInLoginButton,
  TwitterLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import Container from "@material-ui/core/Container";

const styles = {
  message: {
    position: "fixed",
    top: "58px",
    zIndex: "9999",
  },
  button: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
};

export default function Login() {
  const [session, loading] = useSession();
  const router = useRouter();

  if (loading) return null;

  if (session) {
    router.replace("/lists");
  }

  return (
    !loading &&
    !session && (
      <Container maxWidth="xs">
        <GoogleLoginButton
          style={styles.button}
          onClick={() => signIn("google")}
        />
        <FacebookLoginButton
          style={styles.button}
          onClick={() => signIn("facebook")}
        />
        <LinkedInLoginButton
          style={styles.button}
          onClick={() => signIn("linkedin")}
        />
        <TwitterLoginButton
          style={styles.button}
          onClick={() => signIn("twitter")}
        />
        <GithubLoginButton
          style={styles.button}
          onClick={() => signIn("github")}
        />
      </Container>
    )
  );
}

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   if (session) {
//     return {
//       redirect: {
//         destination: "/lists",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }
