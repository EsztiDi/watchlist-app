import { useState, useEffect } from "react";
import { mutate } from "swr";
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
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
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
import useMediaQuery from "@material-ui/core/useMediaQuery";

import CloseModalButton from "../CloseModalButton";

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

export default function Share({
  listID,
  uid,
  auth,
  shared,
  title,
  openShare,
  handleOpenShare,
}) {
  const classes = useStyles();
  const touch = useMediaQuery("(hover: none)");

  const iconSize = 48;
  const textVariant = "caption";
  const shareUrl = `${window.location.origin}/list/${listID}`;
  const editableUrl = `${window.location.origin}/list/${listID}/${uid}`;
  const [shareLink, setShareLink] = useState("");
  const [editable, setEditable] = useState("false");
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setShareLink(`${window.location.origin}/list/${listID}`);
    setEditable("false");
  }, [listID]);

  useEffect(() => {
    setCopied(false);
  }, [editable]);

  const contentType = "application/json";
  const updateShared = async (value) => {
    try {
      const res = await fetch(`/api/lists/${listID}`, {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: JSON.stringify({ shared: value }),
      });

      if (!res.ok) {
        throw new Error(res.status);
      }

      mutate(`/api/lists/shared/${listID}`);
      setUpdating(false);
    } catch (error) {
      console.error(error);
      setUpdating(false);
    }
  };

  const handleEditableChange = (ev) => {
    setEditable(ev.target.value);

    if (ev.target.value === "true") {
      setShareLink(editableUrl);
      if (auth && !shared) {
        setUpdating(true);
        updateShared(true);
      }
    } else {
      setShareLink(shareUrl);
    }
  };

  const copyLink = () => {
    let link = document.getElementById("shareLink");
    link.select();
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => {
      if (!touch) link.blur();
      setCopied(false);
    }, 2000);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={classes.modal}
      open={openShare}
      onClose={handleOpenShare}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openShare}>
        <div className={classes.share}>
          <CloseModalButton onClose={handleOpenShare} />
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
              body={`Hi,${"\n\n"}Look what I have created!${"\n\n"}${title}${"\n"}`}
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
                disabled={updating}
              />
              <FormControlLabel
                value="true"
                control={<Radio color="secondary" />}
                label="Editable"
                labelPlacement="start"
                disabled={/^Watched$/i.test(title) || !uid || updating}
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
