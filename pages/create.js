import Form from "../components/Form";

// get setmessage from props
export default function Create({ setMessage }) {
  const list = {
    title: "My Watchlist",
    movies: [],
    private: false,
    emails: false,
  };

  return <Form list={list} setMessage={setMessage} />;
}
