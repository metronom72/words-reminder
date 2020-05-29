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
import classnames from 'classnames';
import moment from 'moment';
import Chip from "@material-ui/core/Chip";
import EventIcon from '@material-ui/icons/Event';
import DoneIcon from '@material-ui/icons/Done';

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
    textDecoration: 'none',
  },
  header: {
    textAlign: "center",
    paddingBottom: "20px",
    fontSize: "20px",
  },
  active: {
    backgroundColor: 'rgba(0,0,0,0.12)'
  }
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

    const isDone = (title: string) => {
      const today = moment().format("MM/DD/YYYY");
      if (title === today) return 0
      //@ts-ignore
      const diff = moment(title, ["MM/DD/YYYY"]) - moment()
      if (diff > 0) return -1
      else return 1
    }

    return (
      <div className={classes.root}>
        <nav className={classes.drawer}>
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
                <Link key={id} to={`lessons/${id}`} className={classes.link}>
                  <ListItem className={classnames({[classes.active]: lessons.currentLesson.id === id})} button key={id}>
                    <ListItemText primary={<div>{title}{" "}
                        {isDone(title) >= 0 && <Chip
                          label={isDone(title) === 0 ? "Сегодня" : isDone(title) > 0 && "Повторить"}
                          variant="outlined"
                          size="small"
                          color="primary"
                          //@ts-ignore
                          deleteIcon={isDone(title) === 0 ? <EventIcon /> : isDone(title) > 0 && <DoneIcon />}
                        />}
                      </div>} />
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
