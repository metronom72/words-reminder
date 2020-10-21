export enum GAActions {
    SWITCH_LANGUAGE = "switch_language",
    SHOW_TRANSLATION = "show_translation",
    NEXT_WORD = "next_word",
    NEXT_CARD = "next_card",
    COLD_START = "cold_start",
    CARD_FINISHED = "card_finished",
    CARD_OPENED = "card_opened",
    PREVIOUS_WORD = "previous_word",
}

export enum LANGUAGES {
    RUSSIAN = "russian",
    DEUTSCH = "german",
}

export enum LESSON_TYPES {
    SINGLE_CARD = "lessons",
    TABLE = "tables"
}

export enum STORAGE_CONSTANTS {
    LAST_LEARNED_ID = '__last_learned_id__',
    LAST_ACCESSED_DATE = '__last_accessed_date__'
}

export const DEFAULT_LAST_LEARNED_ID = 15

export const DEFAULT_FRAME_LENGTH = 7

export const DEFAULT_DATE_FORMAT = "MM/DD/YYYY"
