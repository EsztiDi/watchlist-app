import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Form from "../components/Form";

export default function Create({ setMessage }) {
  const [session, loading] = useSession();
  const router = useRouter();

  const list = {
    title: "My Watchlist",
    movies: [],
    private: true,
    emails: false,
  };

  if (loading) return null;

  if (!loading && !session) {
    router.replace("/login");
  }

  return session && <Form list={list} setMessage={setMessage} />;
}
