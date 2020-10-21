import lessons from "../data/Lessons";
import {observable} from "mobx";
import {sendEvent} from "../config/GoogleAnalytics";
import {
    DEFAULT_DATE_FORMAT,
    DEFAULT_LAST_LEARNED_ID,
    GAActions,
    LANGUAGES,
    STORAGE_CONSTANTS
} from "../config/Constants";
import {History} from "@reach/router";
import moment from "moment";

export interface IWord {
    russian: string;
    german: string;
    description?: string;
}

export interface ILesson {
    title: string;
    id: number;
    words: IWord[];
}

export class LessonsStore {
    public lessons: ILesson[] = [];
    @observable public currentLesson: any = null;
    @observable public currentWord: number = 0;
    @observable public targetLanguage: string = LANGUAGES.RUSSIAN;
    @observable public isTargetVisible: boolean = false;
    @observable public lastAccessedDate: string;
    @observable public lastLearnedLessonId: number = parseInt(window.localStorage.getItem(STORAGE_CONSTANTS.LAST_LEARNED_ID) || `${DEFAULT_LAST_LEARNED_ID}`, 10)
    private history: History;

    constructor(history: History) {
        this.lessons = lessons as any;
        this.currentLesson = lessons[0];
        this.history = history;
        const previousDate = window.localStorage.getItem(STORAGE_CONSTANTS.LAST_ACCESSED_DATE)
        const storedLastLearnedId = window.localStorage.getItem(STORAGE_CONSTANTS.LAST_LEARNED_ID)
        this.lastAccessedDate = moment().format(DEFAULT_DATE_FORMAT)
        if (previousDate !== this.lastAccessedDate) {
            window.localStorage.setItem(STORAGE_CONSTANTS.LAST_ACCESSED_DATE, this.lastAccessedDate)
            if (
                typeof storedLastLearnedId === "string"
                && parseInt(storedLastLearnedId, 10) >= 0
            ) {
                this.setLastLearnedId(parseInt(storedLastLearnedId, 10) + 1)
            } else {
                this.setLastLearnedId(DEFAULT_LAST_LEARNED_ID)
            }
        }
    }

    setLastLearnedId = (lastLearnedLessonId: number) => {
        this.lastLearnedLessonId = lastLearnedLessonId;
        window.localStorage.setItem(STORAGE_CONSTANTS.LAST_LEARNED_ID, lastLearnedLessonId.toString());
    }

    changeCard = (id: number) => {
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
