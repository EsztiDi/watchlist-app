import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Collapse from "@material-ui/core/Collapse";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  share: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    border: "1px solid #FFF",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
  },
  title: {
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1.5),
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing(2),
    "& > *": {
      margin: theme.spacing(1),
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    },
  },
  radios: {
    alignSelf: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  info: {
    textAlign: "center",
    color: theme.palette.secondary.dark,
  },
}));

export default function Share({ listID, uid, title, open, onClose }) {
  const classes = useStyles();

  const shareUrl = `${window.location.origin}/list/${listID}`;
  const editableUrl = `${window.location.origin}/list/${listID}/${uid}`;
  const [shareLink, setShareLink] = React.useState(shareUrl);
  const [editable, setEditable] = React.useState("false");
  const [copied, setCopied] = React.useState(false);

  const handleEditableChange = (ev) => {
    setEditable(ev.target.value);

    ev.target.value === "true"
      ? setShareLink(editableUrl)
      : setShareLink(shareUrl);
  };

  const copyLink = () => {
    var link = document.getElementById("shareLink");
    link.select();
    link.setSelectionRange(0, 99999);
    document.execCommand("copy");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 5000);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.share}>
          <Typography variant="h6" id="modal-title" className={classes.title}>
            Share
          </Typography>
          <div className={classes.buttons}>
            <FacebookShareButton url={shareLink}>
              <FacebookIcon round />
              <Typography variant="subtitle2">Facebook</Typography>
            </FacebookShareButton>
            <FacebookMessengerShareButton url={shareLink}>
              <FacebookMessengerIcon round />
              <Typography variant="subtitle2">Messenger</Typography>
            </FacebookMessengerShareButton>
            <WhatsappShareButton url={shareLink}>
              <WhatsappIcon round />
              <Typography variant="subtitle2">WhatsApp</Typography>
            </WhatsappShareButton>
            <TwitterShareButton url={shareLink}>
              <TwitterIcon round />
              <Typography variant="subtitle2">Twitter</Typography>
            </TwitterShareButton>
            <RedditShareButton url={shareLink}>
              <RedditIcon round />
              <Typography variant="subtitle2">Reddit</Typography>
            </RedditShareButton>
            <LinkedinShareButton url={shareLink}>
              <LinkedinIcon round />
              <Typography variant="subtitle2">LinkedIn</Typography>
            </LinkedinShareButton>

            <EmailShareButton
              url={shareLink}
              subject={title}
              body={`Hi,${"\n\n"}Check out this watchlist I have:${"\n"}${"\n"}${title}${"\n"}`}
            >
              <EmailIcon round />
              <Typography variant="subtitle2">Email</Typography>
            </EmailShareButton>
          </div>
          <TextField
            id="shareLink"
            variant="outlined"
            value={shareLink}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={copyLink}>
                    {copied ? "Copied ✔" : "Copy"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="editable"
              name="editable"
              value={editable}
              onChange={handleEditableChange}
              className={classes.radios}
            >
              <FormControlLabel
                value="false"
                control={<Radio color="primary" />}
                label="Read-only"
                labelPlacement="start"
              />
              <FormControlLabel
                value="true"
                control={<Radio color="secondary" />}
                label="Editable"
                labelPlacement="start"
              />
            </RadioGroup>
          </FormControl>
          <Collapse in={editable === "true"}>
            <Typography variant="subtitle1" className={classes.info}>
              Everyone with this link will be able to edit your list.
            </Typography>
          </Collapse>
        </div>
      </Fade>
    </Modal>
  );
}
