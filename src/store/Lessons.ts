import lessons from "../data/Lessons";
import {observable} from "mobx";
import {sendEvent} from "../config/GoogleAnalytics";
import {GAActions, LANGUAGES, STORAGE_CONSTANTS} from "../config/Constants";
import {History} from "@reach/router";

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
    @observable public lastLearnedLessonId: number = parseInt(window.localStorage.getItem(STORAGE_CONSTANTS.LAST_LEARNED_ID) || '1', 10)
    private history: History;

    constructor(history: History) {
        this.lessons = lessons as any;
        this.currentLesson = lessons[0];
        this.history = history;
        if (
            !window.localStorage.getItem(STORAGE_CONSTANTS.LAST_LEARNED_ID) ||
            typeof window.localStorage.getItem(STORAGE_CONSTANTS.LAST_LEARNED_ID) !== 'string'
        ) {
            this.setLastLearnedId(1)
        }
    }

    setLastLearnedId = (lastLearnedLessonId: number) => {
        this.lastLearnedLessonId = lastLearnedLessonId;
        window.localStorage.setItem(STORAGE_CONSTANTS.LAST_LEARNED_ID, lastLearnedLessonId.toString());
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
