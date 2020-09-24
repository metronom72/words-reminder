// @ts-ignore
import words from "./words.csv"
import {ILesson, IWord} from "../store/Lessons";
import moment from "moment";

const lessons: ILesson[] = [];
const today = new Date("08/22/2020").getTime();
let offset = 0;
const day = 24 * 60 * 60 * 1000;
const wordsLimit = 19;
let lastWordsLimit = wordsLimit;
let lastId = 1;

(words as IWord[]).forEach((word) => {
    if (lastWordsLimit === 0 || lessons.length === 0) {
        lessons.push({
            id: lastId.toString(),
            title: moment(new Date(today + offset * day)).format("MM/DD/YYYY"),
            words: [],
        });
        lessons[lessons.length - 1].words.push(word);
        lastId = lastId + 1;
        offset = offset + 1;
        lastWordsLimit = wordsLimit;
        return;
    }
    lessons[lessons.length - 1].words.push(word);
    lastWordsLimit = lastWordsLimit - 1;
});

export default lessons as ILesson[];
