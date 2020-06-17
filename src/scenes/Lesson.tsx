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
import { ILesson } from "../store/Lessons";
import { GAActions } from "../config/Constants";
import { sendEvent } from "../config/GoogleAnalytics";

const useStyles = makeStyles({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    minWidth: 275,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    width: "100%",
  },
  text: {
    padding: "20px 0 20px 0",
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

    const nextWord = () => {
      if (!lessons.isTargetVisible) {
        showTranslation()
      } else {
        const isWordLast = lessons.currentLesson.words.length - 1 === lessons.currentWord
        if (isWordLast) {
          lessons.switchLanguage()
          
          lessons.currentWord = 0;
          lessons.isTargetVisible = false;
          return;
        }
        lessons.currentWord = lessons.currentWord + 1;
        lessons.isTargetVisible = false;
        sendEvent(GAActions.NEXT_WORD, { current: lessons.currentLesson.words[lessons.currentWord] })
        if (lessons.targetLanguage === 'russian' && isWordLast)sendEvent(GAActions.CARD_FINISHED, { current: lessons.currentLesson.id })
      }
    };

    const previousWord = () => {
      if (lessons.currentWord === 0) return;
      lessons.isTargetVisible = false;
      lessons.currentWord = lessons.currentWord - 1;
      sendEvent(GAActions.PREVIOUS_WORD, { current: lessons.currentLesson.words[lessons.currentWord] })
    };

    const handleArrowKeyboard = (event: any) => {
      if (event.code === "ArrowLeft") {
        previousWord();
      } else if (event.code === "ArrowRight") {
        nextWord();
      }
    };

    const showTranslation = () => {
      lessons.isTargetVisible = true
      sendEvent(GAActions.SHOW_TRANSLATION, {language: lessons.targetLanguage})
    }

    if (!isInit) {
      window.onkeydown = handleArrowKeyboard;
      if (match) {
        const paths = match.uri.split('/')
        const lesson = lessons.lessons.find((lesson: ILesson) => lesson.id.toString() === paths[2])
        if (lesson) lessons.currentLesson = lesson;
        sendEvent(GAActions.CARD_OPENED)
      }
      init(true);
    }

    return (
      <>
        <div className={classes.root}>
          {lessons.currentWord !== 0 && (
            <ChevronLeftIcon onClick={previousWord} />
          )}
          <Card className={classes.card} variant="outlined">
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" className={classes.text}>
                {(lessons.targetLanguage === "russian" ||
                  (lessons.targetLanguage === "german" &&
                    lessons.isTargetVisible)) &&
                  `${lessons.currentWord + 1}. ${
                    lessons.currentLesson.words[lessons.currentWord].german
                  }`}
                {lessons.targetLanguage === "german" &&
                  !lessons.isTargetVisible && (
                    <VisibilityIcon
                      onClick={showTranslation}
                    />
                  )}
              </Typography>
              <Divider />
              <Typography variant="h5" className={classes.text}>
                {(lessons.targetLanguage === "german" ||
                  (lessons.targetLanguage === "russian" &&
                    lessons.isTargetVisible)) &&
                  `${lessons.currentWord + 1}. ${
                    lessons.currentLesson.words[lessons.currentWord].russian
                  }`}
                {lessons.targetLanguage === "russian" &&
                  !lessons.isTargetVisible && (
                    <VisibilityIcon
                      onClick={showTranslation}
                    />
                  )}
              </Typography>
            </CardContent>
          </Card>
          <ChevronRightIcon onClick={nextWord} />
        </div>
        <HelpDescriptionComponent />
      </>
    );
  })
);
