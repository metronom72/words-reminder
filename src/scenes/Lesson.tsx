import React from "react";
import {RouteComponentProps, useLocation, useMatch, useNavigate} from "@reach/router";
import Card from "@material-ui/core/Card";
import {makeStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {inject, observer} from "mobx-react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {GAActions, LANGUAGES, LESSON_TYPES} from "../config/Constants";
import {sendEvent} from "../config/GoogleAnalytics";
import cn from "classnames";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    card: {
        width: 350,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    cardContent: {
        width: "100%",
    },
    invisible: {
        visibility: "hidden",
    },
    text: {
        padding: "20px 0 20px 0",
        position: "relative",
    },
    wrapper: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    actionsWrapper: {
        width: "100%",
        position: "sticky",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "25px",
        paddingBottom: "5px",
        top: "55px",
        background: "white",
        borderBottom: "1px solid rgb(225,225,225)",
    },
    actions: {
        maxWidth: 350,
        width: "100%",
        height: "30px",
        position: "relative",
    },
    leftChevron: {
        position: "absolute",
        left: 0,
    },
    rightChevron: {
        position: "absolute",
        right: 0,
    },
    chevron: {
        padding: "0 20px",
        marginBottom: "10px",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        border: "1px solid rgba(0,0,0,0.25)",
        borderRadius: 2,
        "&:hover": {
            cursor: "pointer",
            borderColor: "rgba(0,0,0,0.4)",
        },
    },
    eye: {
        width: "100%",
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    relativeEye: {
        width: "100%",
        height: 0,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    table: {
        width: '100%',
        minWidth: '350px',
        maxWidth: '500px'
    }
});

export const LessonComponent: React.FC<RouteComponentProps & any> = inject(
    "lessonsStore"
)(
    observer(({lessonsStore}) => {
        const classes = useStyles();
        const location = useLocation();
        const navigate = useNavigate()
        const match = useMatch(location.pathname);
        const [isInit, init] = React.useState(false);
        const lessonType = match ? match.uri.split("/")[1] : null;

        const hasPreviousCard = () => {
            const isTargetLanguageRussian = lessonsStore.targetLanguage === LANGUAGES.RUSSIAN;
            const isFirstWord = lessonsStore.currentWord === 0;
            const isFirstCard = lessonsStore.currentLesson
                && lessonsStore.lessons[0]
                && lessonsStore.currentLesson.id === lessonsStore.lessons[0].id
            return !(isTargetLanguageRussian && isFirstWord && isFirstCard);
        }

        const hasNextCard = () => {
            const isTargetLanguageDeutsch = lessonsStore.targetLanguage === LANGUAGES.DEUTSCH;
            const isLastWord = lessonsStore.currentLesson
                && lessonsStore.currentWord === lessonsStore.currentLesson.words.length - 1;
            const isLastCard = lessonsStore.currentLesson
                && lessonsStore.currentLesson.id === lessonsStore.lessons[lessonsStore.lessons.length - 1].id;
            const isTargetVisible = lessonsStore.isTargetVisible;
            return !(isTargetVisible && isTargetLanguageDeutsch && isLastWord && isLastCard);
        }

        const isWordLast = () =>
            lessonsStore.currentLesson.words.length - 1 === lessonsStore.currentWord;

        const isWordFirst = () =>
            lessonsStore.currentWord === 0;

        const scrollToBottom = () => {
            const scrollingElement = (document.scrollingElement || document.body);
            scrollingElement.scrollTop = scrollingElement.scrollHeight;
        }

        const nextWord = () => {
            if (!lessonsStore.isTargetVisible) {
                showTranslation();
                if (lessonType === LESSON_TYPES.TABLE) {
                    nextWord();
                    scrollToBottom();
                }
            } else {
                if (isWordLast() && hasNextCard()) {
                    if (lessonsStore.targetLanguage === LANGUAGES.DEUTSCH) {
                        const nextId = (
                            parseInt(lessonsStore.currentLesson.id, 10) + 1
                        ).toString();
                        lessonsStore.changeCard(nextId);
                        sendEvent(GAActions.CARD_FINISHED, {
                            current: lessonsStore.currentLesson.id,
                        });
                        return;
                    }
                    lessonsStore.switchLanguage();
                    lessonsStore.currentWord = 0;
                    lessonsStore.isTargetVisible = false;
                    return;
                }
                if (hasNextCard()) {
                    lessonsStore.currentWord = lessonsStore.currentWord + 1;
                    lessonsStore.isTargetVisible = false;
                    sendEvent(GAActions.NEXT_WORD, {
                        current: lessonsStore.currentLesson.words[lessonsStore.currentWord],
                    });
                }
            }
        };

        const previousWord = () => {
            if (!hasPreviousCard()) return;
            if (isWordFirst() && hasPreviousCard()) {
                const previousId = (
                    parseInt(lessonsStore.currentLesson.id, 10) - 1
                ).toString();
                lessonsStore.changeCard(previousId);
                return;
            }
            lessonsStore.isTargetVisible = false;
            lessonsStore.currentWord = lessonsStore.currentWord - 1;
            sendEvent(GAActions.PREVIOUS_WORD, {
                current: lessonsStore.currentLesson.words[lessonsStore.currentWord],
            });
        };

        const handleArrowKeyboard = (event: any) => {
            if (event.code === "ArrowLeft") {
                previousWord();
            } else if (event.code === "ArrowRight") {
                nextWord();
            }
        };

        const showTranslation = () => {
            lessonsStore.isTargetVisible = true;
            sendEvent(GAActions.SHOW_TRANSLATION, {
                language: lessonsStore.targetLanguage,
            });
        };

        if (!isInit) {
            window.onkeydown = handleArrowKeyboard;
            if (match) {
                const paths = match.uri.split("/");
                if (lessonsStore.changeCard(paths[2])) {
                    sendEvent(GAActions.CARD_OPENED);
                }
            }
            init(true);
        }

        if (!lessonsStore.currentLesson.words[lessonsStore.currentWord]) {
            navigate('/')
            return null;
        }

        const columns = [{
            id: LANGUAGES.RUSSIAN,
            label: 'РУССКИЙ',
            width: 175,
        }, {
            id: LANGUAGES.DEUTSCH,
            label: 'DEUTSCH',
            width: 175,
        }]

        return (
            <div style={{width: '100%', position: 'relative'}}>
                <div className={classes.root}>
                    <div className={classes.actionsWrapper}>
                        <div className={classes.actions}>
                            {hasPreviousCard() && <div
                                className={cn(classes.leftChevron, classes.chevron)}
                                onClick={previousWord}
                            >
                                <ChevronLeftIcon/>
                            </div>}
                            {hasNextCard() && <div
                                className={cn(classes.rightChevron, classes.chevron)}
                                onClick={nextWord}
                            >
                                <ChevronRightIcon/>
                            </div>}
                        </div>
                    </div>
                    <div className={classes.wrapper}>
                        {lessonType === LESSON_TYPES.TABLE &&
                        <TableContainer className={classes.table}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                size={"small"}
                                                key={column.id}
                                                style={{width: column.width}}
                                                variant={"footer"}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lessonsStore.currentLesson.words.map((row: any, index: number) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.german}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id}
                                                                   style={{width: row.width, minHeight: 50}}
                                                                   size={"small"}>
                                                            {lessonsStore.currentWord > index && value}
                                                            {lessonsStore.currentWord === index &&
                                                            <>
                                                                {
                                                                    lessonsStore.targetLanguage === LANGUAGES.DEUTSCH &&
                                                                    (column.id === LANGUAGES.DEUTSCH &&
                                                                        !lessonsStore.isTargetVisible ? (
                                                                            <div
                                                                                className={cn(classes.relativeEye)}
                                                                                onClick={showTranslation}>
                                                                                <VisibilityIcon/>
                                                                            </div>
                                                                        ) : value
                                                                    )
                                                                }
                                                                {lessonsStore.targetLanguage === LANGUAGES.RUSSIAN &&
                                                                (column.id === LANGUAGES.RUSSIAN &&
                                                                    !lessonsStore.isTargetVisible ? (
                                                                        <div className={cn(classes.relativeEye)}
                                                                             onClick={showTranslation}>
                                                                            <VisibilityIcon/>
                                                                        </div>
                                                                    ) : value
                                                                )
                                                                }
                                                            </>
                                                            }
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        }
                        {lessonType === LESSON_TYPES.SINGLE_CARD &&
                        <Card className={classes.card} variant="outlined">
                            <CardContent className={classes.cardContent}>
                                <Typography variant="h5" className={classes.text}>
                                    <div
                                        className={cn({
                                            [classes.invisible]: !(
                                                lessonsStore.targetLanguage === LANGUAGES.RUSSIAN ||
                                                (lessonsStore.targetLanguage === LANGUAGES.DEUTSCH &&
                                                    lessonsStore.isTargetVisible)
                                            ),
                                        })}
                                    >
                                        {`${lessonsStore.currentWord + 1}. ${
                                            lessonsStore.currentLesson.words[lessonsStore.currentWord].german
                                        }`}
                                    </div>
                                    {lessonsStore.targetLanguage === LANGUAGES.DEUTSCH &&
                                    !lessonsStore.isTargetVisible && (
                                        <div className={classes.eye} onClick={showTranslation}>
                                            <VisibilityIcon/>
                                        </div>
                                    )}
                                </Typography>
                                <Divider/>
                                <Typography variant="h5" className={classes.text}>
                                    <div
                                        className={cn({
                                            [classes.invisible]: !(
                                                lessonsStore.targetLanguage === LANGUAGES.DEUTSCH ||
                                                (lessonsStore.targetLanguage === LANGUAGES.RUSSIAN &&
                                                    lessonsStore.isTargetVisible)
                                            ),
                                        })}
                                    >
                                        {`${lessonsStore.currentWord + 1}. ${
                                            lessonsStore.currentLesson.words[lessonsStore.currentWord].russian
                                        }`}
                                    </div>
                                    {lessonsStore.targetLanguage === LANGUAGES.RUSSIAN &&
                                    !lessonsStore.isTargetVisible && (
                                        <div className={classes.eye} onClick={showTranslation}>
                                            <VisibilityIcon/>
                                        </div>
                                    )}
                                </Typography>
                            </CardContent>
                        </Card>
                        }
                    </div>
                </div>
            </div>
        );
    })
);
