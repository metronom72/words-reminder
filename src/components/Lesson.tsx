import React from "react";
import { RouteComponentProps } from "@reach/router";
import Card from "@material-ui/core/Card";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { inject, observer } from "mobx-react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { HelpDescriptionComponent } from "./Help";

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

    const [isInit, init] = React.useState(false);

    const nextWord = () => {
      if (!lessons.isTargetVisible) {
        lessons.isTargetVisible = true;
      } else {
        if (lessons.currentLesson.words.length - 1 === lessons.currentWord) return;
        lessons.currentWord = lessons.currentWord + 1;
        lessons.isTargetVisible = false;
      }
    };

    const previousWord = () => {
      if (lessons.currentWord === 0) return
      lessons.isTargetVisible = false;
      lessons.currentWord = lessons.currentWord - 1;
    };

    const handleArrowKeyboard = (event: any) => {
      if (event.code === "ArrowLeft") {
        previousWord();
      } else if (event.code === "ArrowRight") {
        nextWord();
      }
    };

    if (!isInit) {
      window.onkeydown = handleArrowKeyboard;
      init(true);
    }

    return (
      <>
        <div className={classes.root}>
          {lessons.currentWord !== 0 && <ChevronLeftIcon onClick={previousWord} />}
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
                      onClick={() => (lessons.isTargetVisible = true)}
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
                      onClick={() => (lessons.isTargetVisible = true)}
                    />
                  )}
              </Typography>
            </CardContent>
          </Card>
          {lessons.currentLesson.words.length - 1 !== lessons.currentWord && <ChevronRightIcon onClick={nextWord} />}
        </div>
        <HelpDescriptionComponent />
      </>
    );
  })
);
