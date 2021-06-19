import Link from "next/link";

import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import KeyboardArrowUpRoundedIcon from "@material-ui/icons/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@material-ui/icons/KeyboardArrowDownRounded";

import EditTitle from "./EditTitle";

const useStyles = makeStyles((theme) => ({
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    minWidth: "25%",
  },
  tab: {
    fontSize: "1rem",
    minWidth: "100%",
    minHeight: "3.6rem",
    "& > *:first-child": {
      width: "80%",
      flexDirection: "row",
    },
  },
  edit: {
    position: "absolute",
    top: "50%",
    right: "12px",
    transform: "translateY(-50%)",
    // marginRight: theme.spacing(2),
    padding: theme.spacing(0.5),
    borderRadius: "50%",
    fontSize: "2rem",
    color: theme.palette.primary.light,
    transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  arrows: {
    position: "absolute",
    left: "12px",
    display: "flex",
    flexDirection: "column",
    // marginLeft: theme.spacing(2),
    color: theme.palette.primary.light,
    "& > *": {
      height: "1.8rem",
    },
  },
  arrow: {
    borderRadius: "50%",
    fontSize: "1.8rem",
    "&:hover": {
      color: theme.palette.primary.main,
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
}));

function a11yProps(id, idx, val) {
  return {
    id: `tab-${id}`,
    tabIndex: idx,
    "aria-controls": `tabpanel-${id}`,
    "aria-selected": `${idx === val}`,
  };
}

export default function ListTabs({
  id,
  lists,
  updating,
  setUpdating,
  putData,
}) {
  const classes = useStyles();
  const [editTitle, setEditTitle] = React.useState(false);
  const value = lists.map((list) => list._id).indexOf(id);

  const handleEditTitle = () => {
    setEditTitle((prev) => !prev);
    setUpdating(false);
  };

  const moveListUp = (idx) => {
    setUpdating(true);
    const prevPos = lists[idx - 1].position;
    putData({ position: prevPos });
  };

  const moveListDown = (idx) => {
    setUpdating(true);
    const nextPos = lists[idx + 1].position;
    putData({ position: -nextPos });
  };

  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      indicatorColor="secondary"
      aria-label="list tabs"
      value={value}
      className={classes.tabs}
    >
      {lists.map((list, index) =>
        editTitle && value === index ? (
          <EditTitle
            key={list._id}
            title={list.title}
            onEditTitle={handleEditTitle}
            updating={updating}
            setUpdating={setUpdating}
            putData={putData}
          />
        ) : (
          <Link key={list._id} href={`/lists/${list._id}`} replace>
            <Tab
              label={list.title}
              wrapped
              disableFocusRipple
              disabled={updating}
              onClick={editTitle ? handleEditTitle : null}
              className={classes.tab}
              style={value === index ? { opacity: 1 } : null}
              {...a11yProps(id, index, value)}
              icon={
                putData &&
                value === index && (
                  <>
                    <span title="Edit title">
                      <EditRoundedIcon
                        aria-label="edit title"
                        className={classes.edit}
                        onClick={handleEditTitle}
                      />
                    </span>
                    <span className={classes.arrows}>
                      {index !== 0 && (
                        <span title="Move up">
                          <KeyboardArrowUpRoundedIcon
                            aria-label="move list up"
                            className={classes.arrow}
                            onClick={() => moveListUp(index)}
                          />
                        </span>
                      )}
                      {index !== lists.length - 1 && (
                        <span title="Move down">
                          <KeyboardArrowDownRoundedIcon
                            aria-label="move list down"
                            className={classes.arrow}
                            onClick={() => moveListDown(index)}
                          />
                        </span>
                      )}
                    </span>
                  </>
                )
              }
            />
          </Link>
        )
      )}
    </Tabs>
  );
}
