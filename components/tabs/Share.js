import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
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
import Divider from "@material-ui/core/Divider";
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
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #FFF",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
  },
  title: {
    textAlign: "center",
    padding: `${theme.spacing(0.5)}px 0 ${theme.spacing(1.5)}px`,
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(2.5),
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

  const iconSize = 48;
  const textVariant = "caption";
  const shareUrl = `${window.location.origin}/list/${listID}`;
  const editableUrl = `${window.location.origin}/list/${listID}/${uid}`;
  const [shareLink, setShareLink] = React.useState("");
  const [editable, setEditable] = React.useState("false");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setShareLink(`${window.location.origin}/list/${listID}`);
    setEditable("false");
  }, [listID]);

  React.useEffect(() => {
    setCopied(false);
  }, [editable]);

  const handleEditableChange = (ev) => {
    setEditable(ev.target.value);

    ev.target.value === "true"
      ? setShareLink(editableUrl)
      : setShareLink(shareUrl);
  };

  const copyLink = () => {
    let link = document.getElementById("shareLink");
    link.select();
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => {
      link.blur();
      setCopied(false);
    }, 2000);
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
          <Typography variant="h5" id="modal-title" className={classes.title}>
            Share
          </Typography>
          <Divider />
          <div className={classes.buttons}>
            <FacebookShareButton url={shareLink}>
              <FacebookIcon size={iconSize} round />
              <Typography variant={textVariant}>Facebook</Typography>
            </FacebookShareButton>
            <WhatsappShareButton url={shareLink}>
              <WhatsappIcon size={iconSize} round />
              <Typography variant={textVariant}>WhatsApp</Typography>
            </WhatsappShareButton>
            <TwitterShareButton url={shareLink}>
              <TwitterIcon size={iconSize} round />
              <Typography variant={textVariant}>Twitter</Typography>
            </TwitterShareButton>
            <RedditShareButton url={shareLink}>
              <RedditIcon size={iconSize} round />
              <Typography variant={textVariant}>Reddit</Typography>
            </RedditShareButton>
            <LinkedinShareButton url={shareLink}>
              <LinkedinIcon size={iconSize} round />
              <Typography variant={textVariant}>LinkedIn</Typography>
            </LinkedinShareButton>

            <EmailShareButton
              url={shareLink}
              subject={title}
              body={`Hi,${"\n\n"}Look what I have created!${"\n"}${"\n"}${title}${"\n"}`}
            >
              <EmailIcon size={iconSize} round />
              <Typography variant={textVariant}>Email</Typography>
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
              Everyone with this link will be able to edit the movies on your
              list.
            </Typography>
          </Collapse>
        </div>
      </Fade>
    </Modal>
  );
}
