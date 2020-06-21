import React from "react";
import { RouteComponentProps, useMatch, useLocation } from "@reach/router";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { inject, observer } from "mobx-react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { HelpDescriptionComponent } from "../components/Help";
import { GAActions, LANGUAGES } from "../config/Constants";
import { sendEvent } from "../config/GoogleAnalytics";
import classnames from "classnames";
import { ILesson } from "../store/Lessons";

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
});

export const LessonComponent: React.FC<RouteComponentProps & any> = inject(
  "lessons"
)(
  observer(({ lessons }) => {
    const classes = useStyles();
    const location = useLocation();
    const match = useMatch(location.pathname);
    const [isInit, init] = React.useState(false);

    const showLeftChevron = () => {
      const isTargetLanguageRussian = lessons.targetLanguage === LANGUAGES.RUSSIAN;
      const isFirstWord = lessons.currentWord === 0;
      const isFirstCard = lessons.currentLesson && lessons.lessons[0] && lessons.currentLesson.id === lessons.lessons[0].id
      return !(isTargetLanguageRussian && isFirstWord && isFirstCard);
    }

    const showRightChevron = () => {
      const isTargetLanguageDeutsch = lessons.targetLanguage === LANGUAGES.DEUTSCH;
      const isLastWord = lessons.currentLesson && lessons.currentWord === lessons.currentLesson.words.length - 1;
      const isLastCard = lessons.currentLesson && lessons.currentLesson.id === lessons.lessons[lessons.lessons.length - 1].id;
      const isTargetVisible = lessons.isTargetVisible;
      return !(isTargetVisible && isTargetLanguageDeutsch && isLastWord && isLastCard);
    }

    const isWordLast = () =>
      lessons.currentLesson.words.length - 1 === lessons.currentWord;

    const isWordFirst = () =>
      lessons.currentWord === 0;

    const nextWord = () => {
      if (!lessons.isTargetVisible) {
        showTranslation();
      } else {
        if (isWordLast() && showRightChevron()) {
          if (lessons.targetLanguage === LANGUAGES.DEUTSCH) {
            const nextId = (
              parseInt(lessons.currentLesson.id, 10) + 1
            ).toString();
            lessons.changeCard(nextId);
            sendEvent(GAActions.CARD_FINISHED, {
              current: lessons.currentLesson.id,
            });
            return;
          }
          lessons.switchLanguage();
          lessons.currentWord = 0;
          lessons.isTargetVisible = false;
          return;
        }
        if (showRightChevron()) {
          lessons.currentWord = lessons.currentWord + 1;
          lessons.isTargetVisible = false;
          sendEvent(GAActions.NEXT_WORD, {
            current: lessons.currentLesson.words[lessons.currentWord],
          });
        }
      }
    };

    const previousWord = () => {
      if (!showLeftChevron()) return;
      if (isWordFirst() && showLeftChevron) {
        const previousId = (
          parseInt(lessons.currentLesson.id, 10) - 1
        ).toString();
        lessons.changeCard(previousId);
        return;
      }
      lessons.isTargetVisible = false;
      lessons.currentWord = lessons.currentWord - 1;
      sendEvent(GAActions.PREVIOUS_WORD, {
        current: lessons.currentLesson.words[lessons.currentWord],
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
      lessons.isTargetVisible = true;
      sendEvent(GAActions.SHOW_TRANSLATION, {
        language: lessons.targetLanguage,
      });
    };

    if (!isInit) {
      window.onkeydown = handleArrowKeyboard;
      if (match) {
        const paths = match.uri.split("/");
        if (lessons.changeCard(paths[2])) {
          sendEvent(GAActions.CARD_OPENED);
        }
      }
      init(true);
    }

    return (
      <>
        <div className={classes.root}>
          <div className={classes.actions}>
            {showLeftChevron() && <div
              className={classnames(classes.leftChevron, classes.chevron)}
              onClick={previousWord}
            >
              <ChevronLeftIcon />
            </div>}
            {showRightChevron() && <div
              className={classnames(classes.rightChevron, classes.chevron)}
              onClick={nextWord}
            >
              <ChevronRightIcon />
            </div>}
          </div>
          <div className={classes.wrapper}>
            <Card className={classes.card} variant="outlined">
              <CardContent className={classes.cardContent}>
                <Typography variant="h5" className={classes.text}>
                  <div
                    className={classnames({
                      [classes.invisible]: !(
                        lessons.targetLanguage === LANGUAGES.RUSSIAN ||
                        (lessons.targetLanguage === LANGUAGES.DEUTSCH &&
                          lessons.isTargetVisible)
                      ),
                    })}
                  >
                    {`${lessons.currentWord + 1}. ${
                      lessons.currentLesson.words[lessons.currentWord].german
                    }`}
                  </div>
                  {lessons.targetLanguage === LANGUAGES.DEUTSCH &&
                    !lessons.isTargetVisible && (
                      <div className={classes.eye} onClick={showTranslation}>
                        <VisibilityIcon />
                      </div>
                    )}
                </Typography>
                <Divider />
                <Typography variant="h5" className={classes.text}>
                  <div
                    className={classnames({
                      [classes.invisible]: !(
                        lessons.targetLanguage === LANGUAGES.DEUTSCH ||
                        (lessons.targetLanguage === LANGUAGES.RUSSIAN &&
                          lessons.isTargetVisible)
                      ),
                    })}
                  >
                    {`${lessons.currentWord + 1}. ${
                      lessons.currentLesson.words[lessons.currentWord].russian
                    }`}
                  </div>
                  {lessons.targetLanguage === LANGUAGES.RUSSIAN &&
                    !lessons.isTargetVisible && (
                      <div className={classes.eye} onClick={showTranslation}>
                        <VisibilityIcon />
                      </div>
                    )}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
        <HelpDescriptionComponent />
      </>
    );
  })
);
