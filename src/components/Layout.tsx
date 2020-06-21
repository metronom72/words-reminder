import React from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from "@reach/router";
import { inject, observer } from "mobx-react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import classnames from "classnames";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import EventIcon from "@material-ui/icons/Event";
import DoneIcon from "@material-ui/icons/Done";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import { ILesson } from "../store/Lessons";
import { sendEvent } from "../config/GoogleAnalytics";
import { GAActions } from "../config/Constants";

const drawerWidth: number = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    paddingLeft: 0,
    paddingRight: 0,
    position: "relative",
    minHeight: "100vh",
    paddingTop: "75px",
  },
  link: {
    color: "#000000",
    textDecoration: "none",
  },
  header: {
    textAlign: "center",
    paddingBottom: "20px",
    fontSize: "20px",
  },
  active: {
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

export const Layout: React.FC<any> = inject("lessons")(
  observer(({ lessons, children }) => {
    const classes = useStyles();

    const theme = useTheme();

    const container =
      window !== undefined ? () => window.document.body : undefined;

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const switchLanguage = () => {
      lessons.switchLanguage();
    };

    const nextCard = (id: string) => () => {
      sendEvent(GAActions.NEXT_CARD);
      const nextLesson = lessons.lessons.find(
        (lesson: ILesson) => lesson.id === id
      );
      lessons.currentLesson = nextLesson;
      lessons.currentWord = 0;
      lessons.isTargetVisible = false;
      setMobileOpen(false);
    };

    const isDone = (title: string) => {
      const today = moment().format("MM/DD/YYYY");
      if (title === today) return 0;
      //@ts-ignore
      const diff = moment(title, ["MM/DD/YYYY", "M/D/YYYY"]) - moment();
      if (diff > 0) return -1;
      else return 1;
    };

    const drawer = (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem>
            <FormControlLabel
              control={<Switch />}
              label="Русскйи/Deutsch"
              onChange={switchLanguage}
            />
          </ListItem>
          {lessons.lessons.map(
            ({ title, id }: { title: string; id: string }) => (
              <Link
                onClick={nextCard(id)}
                key={id}
                to={`lessons/${id}`}
                className={classes.link}
              >
                <ListItem
                  className={classnames({
                    [classes.active]: lessons.currentLesson.id === id,
                  })}
                  button
                  key={id}
                >
                  <ListItemText
                    primary={
                      <div>
                        {title}{" "}
                        {isDone(title) >= 0 && (
                          <Chip
                            label={
                              isDone(title) === 0
                                ? "Сегодня"
                                : isDone(title) > 0 && "Повторить"
                            }
                            variant="outlined"
                            size="small"
                            color="primary"
                            //@ts-ignore
                            deleteIcon={
                              isDone(title) === 0 ? (
                                <EventIcon />
                              ) : (
                                isDone(title) > 0 && <DoneIcon />
                              )
                            }
                          />
                        )}
                      </div>
                    }
                  />
                </ListItem>
              </Link>
            )
          )}
        </List>
      </div>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              {lessons.currentLesson.title} (
              {lessons.currentLesson.words.length} ) слов
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              container={container}
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <Paper variant="outlined" elevation={0} className={classes.content}>
          {children}
        </Paper>
      </div>
    );
  })
);
