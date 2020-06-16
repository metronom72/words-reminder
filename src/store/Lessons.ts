import lessons from "../data/Lessons";
import { observable } from "mobx";

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
  @observable public targetLanguage: string = "russian";
  @observable public isTargetVisible: boolean = false;
  constructor(history: any) {
    this.lessons = lessons as any;
    this.currentLesson = lessons[0];
  }
}
