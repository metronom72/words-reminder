import React from "react";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import {makeStyles, useTheme} from "@material-ui/core/styles";
import {Link, useLocation, useMatch} from "@reach/router";
import {inject, observer} from "mobx-react";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import cn from "classnames";
// import moment from "moment";
import Chip from "@material-ui/core/Chip";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import {sendEvent} from "../config/GoogleAnalytics";
import {DEFAULT_FRAME_LENGTH, GAActions, LESSON_TYPES} from "../config/Constants";
import {Box, TextField} from '@material-ui/core';

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
        paddingTop: "50px",
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
    switchViewLink: {
        color: 'white',
        justifySelf: "flex-end"
    },
    textFieldBox: {
        padding: '5px',
        background: 'white',
        margin: '5px 0',
        borderRadius: '5px',
    },
    linkBox: {
        marginLeft: '5px'
    }
}));

export const Layout: React.FC<any> = inject("lessonsStore")(
    observer(({lessonsStore, children}) => {
        const classes = useStyles();
        const location = useLocation();
        const match = useMatch(location.pathname);
        const theme = useTheme();
        const container =
            window !== undefined ? () => window.document.body : undefined;

        const [mobileOpen, setMobileOpen] = React.useState(false);

        const handleDrawerToggle = () => {
            setMobileOpen(!mobileOpen);
        };

        const inFrame = (id: number) => {
            return (lessonsStore.lastLearnedLessonId - id) >= 0 &&
                lessonsStore.lastLearnedLessonId - id < DEFAULT_FRAME_LENGTH;
        }

        const getLessonLabel = (id: number) => {
            if (id === lessonsStore.lastLearnedLessonId) {
                return "Сегодня"
            }
            return "Повторить"
        }

        const switchLanguage = () => {
            lessonsStore.switchLanguage();
        };

        const nextCard = (id: number) => () => {
            if (lessonsStore.changeCard(id)) {
                sendEvent(GAActions.NEXT_CARD);
            }
            setMobileOpen(false);
        };

        const isDone = (id: number) => {
            return inFrame(id)
        };

        const lessonType = match ? match.uri.split("/")[1] : null;

        const drawer = (
            <div>
                <div className={classes.toolbar}/>
                <Divider/>
                <List>
                    <ListItem>
                        <FormControlLabel
                            control={<Switch/>}
                            label="Русскйи/Deutsch"
                            onChange={switchLanguage}
                        />
                    </ListItem>
                    {lessonsStore.lessons.map(
                        ({title, id}: { title: string; id: number }) => (
                            isDone(id) ? (
                                <Link
                                    onClick={nextCard(id)}
                                    key={id}
                                    to={`${lessonType || 'lessons'}/${id}`}
                                    className={classes.link}
                                >
                                    <ListItem
                                        className={cn({
                                            [classes.active]: lessonsStore.currentLesson.id === id,
                                        })}
                                        button
                                        key={id}
                                    >
                                        <ListItemText
                                            primary={
                                                <div>
                                                    {id}. {title}{" "}
                                                    {isDone(id) && (
                                                        <Chip
                                                            label={getLessonLabel(id)}
                                                            variant="outlined"
                                                            size="small"
                                                            color="primary"
                                                        />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                </Link>
                            ) : null))}
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar style={{justifyContent: "space-between", display: "flex"}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            {lessonsStore.currentLesson.title} (
                            {lessonsStore.currentLesson.words.length} ) слов
                        </Typography>
                        <Box className={cn(classes.textFieldBox)}>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={lessonsStore.lastLearnedLessonId}
                                onChange={(event) => lessonsStore.setLastLearnedId(event.target.value)}
                            />
                        </Box>
                        <Box className={cn(classes.linkBox)}>
                            <Link
                                onClick={nextCard(lessonsStore.currentLesson.id)}
                                key={lessonsStore.currentLesson.id}
                                to={`${lessonType === LESSON_TYPES.SINGLE_CARD ? "tables" : "lessons"}/${lessonsStore.currentLesson.id}`}
                                className={classes.switchViewLink}
                            >
                                {lessonType === LESSON_TYPES.SINGLE_CARD ? "Табличный вид" : "Просмотр карточек"}
                            </Link>
                        </Box>
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
