import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import Head from "next/head";

import Form from "../components/Form";

export default function Create({ setMessage }) {
  const [session, loading] = useSession();
  const router = useRouter();

  const list = {
    title: "",
    movies: [],
    private: true,
    emails: false,
  };

  if (loading) return null;

  if (!loading && !session) {
    router?.replace("/login");
  }

  return (
    session && (
      <>
        <Head>
          <title>Create - My Watchlists</title>
        </Head>
        <Form list={list} setMessage={setMessage} />
      </>
    )
  );
}
