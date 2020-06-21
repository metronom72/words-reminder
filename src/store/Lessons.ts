import lessons from "../data/Lessons";
import { observable } from "mobx";
import { sendEvent } from "../config/GoogleAnalytics";
import { GAActions, LANGUAGES } from "../config/Constants";
import { History } from "@reach/router";

export interface IWord {
  russian: string;
  german: string;
  description?: string;
}

export interface ILesson {
  title: string;
  id: string;
  words: IWord[];
}

export class LessonsStore {
  public lessons: ILesson[] = [];
  @observable public currentLesson: any = null;
  @observable public currentWord: number = 0;
  @observable public targetLanguage: string = LANGUAGES.RUSSIAN;
  @observable public isTargetVisible: boolean = false;
  private history: History;
  constructor(history: History) {
    this.lessons = lessons as any;
    this.currentLesson = lessons[0];
    this.history = history;
  }
  changeCard = (id: string) => {
    const nextLesson = this.lessons.find((lesson: ILesson) => lesson.id === id);
    if (!nextLesson) {
      this.history.navigate("/");
      return false;
    }
    this.currentLesson = nextLesson;
    this.currentWord = 0;
    this.isTargetVisible = false;
    this.targetLanguage = LANGUAGES.RUSSIAN;
    return true;
  };
  switchLanguage = () => {
    const previousLanguage = this.targetLanguage;
    const currentLanguage =
      this.targetLanguage === LANGUAGES.RUSSIAN
        ? LANGUAGES.DEUTSCH
        : LANGUAGES.RUSSIAN;
    sendEvent(GAActions.SWITCH_LANGUAGE, {
      current: this.targetLanguage,
      previous: previousLanguage,
    });
    this.targetLanguage = currentLanguage;
  };
}
