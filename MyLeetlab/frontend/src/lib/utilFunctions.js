// NOTE: The backend (backend/src/libs/judge0lib.js) is the single source of
// truth for supported languages, exposed via GET /languages. These maps are a
// convenience fallback kept in sync with that endpoint. Prefer the language list
// from useLanguageStore where available.

// language key -> Judge0 language id (aligned with backend judge0lib).
const LANGUAGE_ID_MAP = {
    C: 50,
    CPP: 54,
    "C++": 54,
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    JS: 63,
};

export const getJudge0LanguageID = (language) => {
    if (!language) return null;
    return LANGUAGE_ID_MAP[String(language).toUpperCase()] ?? null;
};

// Judge0 language id -> canonical language name (aligned with backend).
const LANGUAGE_NAME_MAP = {
    50: "C",
    54: "CPP",
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
};

export const getLanguageName = (language_id) => {
    return LANGUAGE_NAME_MAP[language_id] || "Unknown";
};

// Map a canonical language key to the Monaco editor language id.
// e.g. CPP -> "cpp", JAVASCRIPT -> "javascript". Falls back to lowercased key.
const MONACO_LANGUAGE_MAP = {
    C: "c",
    CPP: "cpp",
    "C++": "cpp",
    PYTHON: "python",
    JAVA: "java",
    JAVASCRIPT: "javascript",
    JS: "javascript",
};

export const getMonacoLanguage = (language) => {
    if (!language) return "plaintext";
    return MONACO_LANGUAGE_MAP[String(language).toUpperCase()] ?? String(language).toLowerCase();
};
