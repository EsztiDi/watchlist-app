import useSWR from "swr";

import ListPanels from "../../components/ListPanels";

export default function Lists({ setMessage }) {
  // const [fetching, setFetching] = React.useState(true);
  // const [newUser, setNewUser] = React.useState(false);

  // React.useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;

  //   const getProps = async () => {
  //     await fetch("/api/lists/newuser", { signal })
  //       .then((res) => res.json())
  //       .then((res) => {
  //         setNewUser(res.data.newUser);
  //       });
  //     setFetching(false);
  //   };
  //   getProps();

  //   return () => {
  //     controller.abort();
  //   };
  // }, []);
  var newUser = null;

  const { data, error } = useSWR("/api/lists/newuser");
  if (error) console.error(error);

  if (data) ({ newUser } = data);

  return <ListPanels setMessage={setMessage} />;
}
