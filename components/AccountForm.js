import Image from "next/image";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: "auto",
    paddingBottom: theme.spacing(4),
  },
  grid: {
    "& > *": {
      margin: theme.spacing(1.5),
    },
  },
  gridMobile: {
    "& > *": {
      margin: `${theme.spacing(1.5)}px ${theme.spacing(0)}px`,
    },
  },
  avatars: {
    "& img": {
      borderRadius: "50%",
    },
  },
}));

export default function AccountForm({
  setMessage,
  updatingForm,
  setUpdatingForm,
}) {
  const classes = useStyles();
  const router = useRouter();

  const contentType = "application/json";
  const matches2 = useMediaQuery("(max-width:768px)");

  const { data: user, error } = useSWR(`/api/account`);
  if (error) console.error(error);

  var avatars = [
    `${process.env.BASE_URL}/batman.png`,
    `${process.env.BASE_URL}/harley.png`,
    `${process.env.BASE_URL}/heisenberg.png`,
    `${process.env.BASE_URL}/spirited.png`,
    `${process.env.BASE_URL}/jason.png`,
    `${process.env.BASE_URL}/chaplin.png`,
    `${process.env.BASE_URL}/marilyn.png`,
    `${process.env.BASE_URL}/sloth.png`,
    `${process.env.BASE_URL}/sheep.png`,
    `${process.env.BASE_URL}/avocado.png`,
    `${process.env.BASE_URL}/deadpool.jpg`,
  ];

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    image: "",
    origName: "",
    origImage: "",
  });

  React.useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        image: user.image ? user.image : `${process.env.BASE_URL}/deadpool.jpg`,
        origName: user.origName ? user.origName : user.name,
        origImage: user.origImage ? user.origImage : user.image,
      });
    }
    // eslint-disable-next-line
  }, [user]);

  const putData = async (newForm) => {
    try {
      const res = await fetch(`/api/account`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify(newForm),
      });

      const { success } = await res.json();

      if (!res.ok || !success) {
        throw new Error(res.status);
      }
      if (success) setMessage("Changes saved!");

      mutate("/api/account");
      setUpdatingForm(false);
      if (newForm.image !== user?.image) {
        setTimeout(() => {
          router?.reload();
        }, 1000);
      }
    } catch (error) {
      setMessage(
        `${error.message} - Failed to update your account, please try again.`
      );
      setUpdatingForm(false);
    }
  };

  const handleChange = (ev) => {
    const target = ev.target;
    const value = target.value;
    const name = target.name;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUpdatingForm(true);
    putData(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={classes.form}
      style={matches2 ? { width: "100%" } : { width: "70%" }}
    >
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        wrap="nowrap"
        className={matches2 ? classes.gridMobile : classes.grid}
      >
        <Grid item>
          <TextField
            name="name"
            label="Display name"
            value={form.name}
            variant="outlined"
            required
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            name="origName"
            label="Full name"
            value={form.origName}
            variant="outlined"
            required
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item>
          <TextField
            name="email"
            label="Email address"
            type="email"
            value={form.email}
            variant="outlined"
            disabled
            fullWidth
            onChange={handleChange}
          />
        </Grid>
        <Grid item className={classes.avatars}>
          <RadioGroup
            row
            aria-label="user avatar"
            name="image"
            value={form.image}
            onChange={handleChange}
            style={{ justifyContent: "center" }}
          >
            {form.origImage && !avatars.includes(form.origImage) && (
              <FormControlLabel
                value={form.origImage}
                control={<Radio color="primary" />}
                labelPlacement="bottom"
                label={
                  <Image src={form.origImage} alt="" width={60} height={60} />
                }
              />
            )}
            {avatars.map((url, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={url}
                  control={<Radio color="primary" />}
                  labelPlacement="bottom"
                  label={<Image src={url} alt="" width={60} height={60} />}
                />
              );
            })}
          </RadioGroup>
        </Grid>
        <Grid item style={{ marginTop: 0 }}>
          <Typography variant="caption">
            <a
              href="https://icon-icons.com/users/Wr7JciO5Hm2DlNyMTXCi9/icon-sets/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Avatars by Laura Reen from icon-icons.com
            </a>
          </Typography>
        </Grid>
        <Grid item className={classes.grid}>
          <Button
            type="submit"
            size="large"
            variant="contained"
            color="primary"
            disabled={updatingForm}
          >
            {updatingForm ? (
              <CircularProgress size="1.5rem" thickness={5} />
            ) : (
              "Save"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
