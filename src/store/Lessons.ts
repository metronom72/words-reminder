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
    this.lessons = lessons;
    this.currentLesson = lessons[0];
    //@ts-ignore
    history.listen(({ action, location }) => {
      if (action === "PUSH" && /^\/lessons\/\d+$/.test(location.pathname)) {
        const lessonId = location.pathname.split("/")[2];
        const lesson = this.lessons.find(
          (lesson: ILesson) => lesson.id === lessonId
        );
        if (lesson) {
          this.currentLesson = lesson;
          this.currentWord = 0;
        }
      }
    });
  }
}
