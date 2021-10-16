import introJs from "intro.js";

import ListPanels from "../../components/ListPanels";

export default function ListPanel({ setMessage }) {
  const [fetching, setFetching] = React.useState(true);
  const [newUser, setNewUser] = React.useState(false);
  const [email, setEmail] = React.useState("");

  React.useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getProps = async () => {
      await fetch("/api/lists/newuser", { signal })
        .then((res) => res.json())
        .then((res) => {
          setNewUser(res?.data?.newUser);
          setEmail(res?.data?.email);
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
              intro: "Hi there! 👋<br/><br/>Let me give you a quick tour. 🧐",
            },
            {
              title: "Your watchlists",
              element: document.querySelector("#list-tabs"),
              intro: `You will find all the watchlists you create here as well as your <b>saved lists</b> made by others.<br/><br/>
              You can change their <b>order</b> with the arrows and the <b>title</b> with the pen.`,
            },
            {
              title: "The Watched list",
              element: document.querySelector("a[data-id='watched-tab']"),
              intro: `The <b>Watched</b> list is different from other lists.<br/><br/>
              Anything you add to it will be marked "watched", and anything you set "watched" will be added to the list. Just click the tick on the poster. ✅<br/><br/>
              If you have a tv show on this list that has new episodes you haven't marked as watched, you'll see a "<b>NEW</b>" badge.`,
            },
            {
              title: "Privacy setting",
              element: document.querySelector("#private"),
              intro: `Private lists are <b>not</b> featured on the <b>Discover</b> page but can still be shared by you.`,
            },
            {
              title: "Weekly email",
              element: document.querySelector("#emails"),
              intro: `Receive an email summary of upcoming releases to ${email} every Thursday.<br/><br/>
              With this toggle, you can sign up and set the list to be included in the email.<br/><br/>
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
              intro: `Click here to see all the releases of this list on the calendar. 😎`,
            },
            {
              title: "Farewell",
              intro: "Enjoy! 🙂",
            },
          ],
        })
        .onbeforeexit(() => {
          return confirm("Close the tutorial?");
        })
        .start();
    };

    if (newUser && !fetching) {
      setTimeout(() => {
        intro();
      }, 2000);
    }
  }, [newUser, email, fetching]);

  return <ListPanels setMessage={setMessage} />;
}
