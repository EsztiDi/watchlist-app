import introJs from "intro.js";

import ListPanels from "../../components/ListPanels";

export default function ListPanel({ setMessage }) {
  const [fetching, setFetching] = React.useState(true);
  const [newUser, setNewUser] = React.useState(false);

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProps = async () => {
      await fetch("/api/lists/newuser", { signal })
        .then((res) => res.json())
        .then((res) => {
          setNewUser(res.data?.newUser);
        });
      setFetching(false);
    };
    getProps();

    return () => {
      controller.abort();
    };
  }, []);

  React.useEffect(() => {
    const intro = () => {
      introJs()
        .setOptions({
          disableInteraction: true,
          scrollToElement: false,
          hidePrev: true,
          steps: [
            {
              title: "Welcome",
              intro: "Hi there! 👋<br/><br/>Let me give you a quick tour.",
            },
            {
              title: "Your watchlists",
              element: document.querySelector("#list-tabs"),
              intro: `You will find all the watchlists you create here as well as your <b>saved lists</b> made by others.<br/><br/>
              You can change their order with the arrows and the title with the pen.`,
            },
            {
              title: "Privacy setting",
              element: document.querySelector("#private"),
              intro: `Private lists are <b>not</b> featured on the <b>Discover</b> page but can still be shared by you.`,
            },
            {
              title: "Weekly email",
              element: document.querySelector("#emails"),
              intro: `Receive an email on Thursdays of upcoming releases from your watchlists, if there's any.<br/><br/>
              You can set this per list which ones to include in the email.<br/><br/>
              You can <b>unsubscribe</b> all with one button on your <b>Account</b> page.`,
            },
            {
              title: "Share",
              element: document.querySelector("#share"),
              intro: `You can share a read-only or editable version of your list.<br/><br/>
              On the <b>editable</b> version the movies can be changed by anyone you share the link with.<br/><br/>
              It's great for planning movie nights. 🤗`,
            },
            {
              title: "Calendar view",
              element: document.querySelector("#calendar"),
              intro: `Click here to see all the release dates of this list on the calendar. 😎`,
            },
            {
              title: "Farewell",
              intro: "Enjoy! 🙂",
            },
          ],
        })
        .onbeforeexit(() => {
          return confirm("Are you sure?");
        })
        .start();
    };
    if (newUser && !fetching) {
      setTimeout(() => {
        intro();
      }, 1000);
    }
  }, [newUser, fetching]);

  return <ListPanels setMessage={setMessage} />;
}
