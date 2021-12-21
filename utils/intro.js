export default async function intro(email, setNewUser) {
  var { default: introJs } = await import("intro.js");

  introJs()
    .setOptions({
      disableInteraction: true,
      scrollToElement: false,
      hidePrev: true,
      steps: [
        {
          title: "Welcome",
          intro: "Hi there! 👋<br/><br/>Let me give you a quick tour. 🔎",
        },
        {
          title: "Your watchlists",
          element: document.querySelector("#list-tabs"),
          intro: `You will find all the watchlists you create here as well as your <b>saved lists</b>.<br/><br/>
                You can change their <b>order</b> with the arrows and the <b>title</b> with the pen.`,
        },
        {
          title: "The Watched list",
          element: document.querySelector("a[data-id='watched-tab']"),
          intro: `The <b>Watched</b> list is different from other lists.<br/><br/>
                Anything you add to it will be marked "watched", and anything you set "watched" will be added to the list.<br/>
                Just click the <b>tick</b> on the movie poster. ✅`,
        },
        {
          title: "The Watched list",
          element: document.querySelector("a[data-id='watched-tab']"),
          intro: `If a tv show on this list has episodes you haven't watched, you'll see a "<b>NEW</b>" badge at their title.`,
        },
        {
          title: "Add movies",
          element: document.querySelector("#add"),
          intro: `Click here to add movies and TV shows to the list.`,
        },
        {
          title: "Privacy setting",
          element: document.querySelector("#private"),
          intro: `Private lists are <b>not</b> featured on the <b>Discover</b> page but can still be shared by you.<br/><br/>
                You can change your <b>display name</b> for public and shared lists on your <b>Account</b> page.`,
        },
        {
          title: "Weekly email",
          element: document.querySelector("#emails"),
          intro: `Receive an email summary of upcoming releases to <b>${email}</b> every Thursday.<br/><br/>
                With this toggle, you can sign up and set this list to be included in the email.<br/><br/>
                You can <b>unsubscribe</b> all with one button on your <b>Account</b> page.`,
        },
        {
          title: "Share",
          element: document.querySelector("#share"),
          intro: `You can share a read-only or editable version of your list.<br/><br/>
                On the <b>editable</b> version, the movies and the title can be changed by everyone you share the link with.<br/><br/>
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
      setNewUser(false);
      return confirm("Close tutorial?");
    })
    .start();
}
