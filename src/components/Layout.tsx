import React from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "@reach/router";
import { inject, observer } from "mobx-react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

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
  },
  link: {
    color: "#000000",
  },
  header: {
    textAlign: "center",
    paddingBottom: "20px",
    fontSize: "20px",
  },
}));

export const Layout: React.FC<any> = inject("lessons")(
  observer(({ lessons, children }) => {
    const classes = useStyles();
    const switchLanguage = () => {
      if (lessons.targetLanguage === "german") {
        lessons.targetLanguage = "russian";
      } else if (lessons.targetLanguage === "russian") {
        lessons.targetLanguage = "german";
      }
    };

    return (
      <div className={classes.root}>
        <nav className={classes.drawer}>
          <List>
            <ListItem>
              <FormControlLabel
                control={<Switch />}
                label="Русскйи/Deutsch"
                onClick={switchLanguage}
              />
            </ListItem>
            {lessons.lessons.map(
              ({ title, id }: { title: string; id: string }) => (
                <Link key={id} to={`lessons/${id}`} className={classes.link}>
                  <ListItem button key={id}>
                    <ListItemText primary={title} />
                  </ListItem>
                </Link>
              )
            )}
          </List>
        </nav>
        <Paper variant="outlined" elevation={0} className={classes.content}>
          <Typography className={classes.header}>
            {lessons.currentLesson.title} ({lessons.currentLesson.words.length}{" "}
            ) слов
          </Typography>
          {children}
        </Paper>
      </div>
    );
  })
);
