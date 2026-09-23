import axios from "axios";
import { apiError } from "../utils/api.error.js";

// ---------------------------------------------------------------------------
// Single source of truth for supported languages.
// Each entry: canonical key (stored in problem JSON + submissions), Judge0
// language id, a human label, and the Monaco editor language id for the UI.
// getJudge0LanguageID / getLanguageName / SUPPORTED_LANGUAGES all derive from
// this — do not maintain a second list anywhere (frontend consumes GET /languages).
// ---------------------------------------------------------------------------
export const LANGUAGES = [
  { key: "C", id: 50, label: "C", monaco: "c" },
  { key: "CPP", id: 54, label: "C++", monaco: "cpp" },
  { key: "PYTHON", id: 71, label: "Python", monaco: "python" },
  { key: "JAVA", id: 62, label: "Java", monaco: "java" },
  { key: "JAVASCRIPT", id: 63, label: "JavaScript", monaco: "javascript" },
];

// Canonical language keys (uppercase) used as JSON keys and for validation.
export const SUPPORTED_LANGUAGES = LANGUAGES.map((l) => l.key);

// Accept a few common aliases when resolving a name to an id.
const ALIAS_TO_KEY = {
  C: "C",
  CPP: "CPP",
  "C++": "CPP",
  PYTHON: "PYTHON",
  PY: "PYTHON",
  JAVA: "JAVA",
  JAVASCRIPT: "JAVASCRIPT",
  JS: "JAVASCRIPT",
};

const KEY_TO_ID = Object.fromEntries(LANGUAGES.map((l) => [l.key, l.id]));
const ID_TO_KEY = Object.fromEntries(LANGUAGES.map((l) => [l.id, l.key]));

// Convert language name to Judge0 language ID. Returns null if unsupported.
export const getJudge0LanguageID = (language) => {
  if (!language) return null;
  const key = ALIAS_TO_KEY[String(language).toUpperCase()];
  return key ? KEY_TO_ID[key] : null;
};

// Get canonical language name from a Judge0 language ID.
export const getLanguageName = (language_id) => {
  return ID_TO_KEY[language_id] || "Unknown";
};

// True if a language key/name is supported.
export const isSupportedLanguage = (language) => getJudge0LanguageID(language) !== null;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Submit multiple code submissions
export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": process.env.SULU_API_TOKEN,
      },
    }
  );

  if (process.env.NODE_ENV !== "production") {
    console.info("Judge0 batch submitted", {
      submissionCount: Array.isArray(data) ? data.length : 0,
      responseType: Array.isArray(data) ? "array" : typeof data,
    });
  }
  return data;
};

// Poll until all submissions are completed, bounded by a max elapsed time so a
// stalled Judge0 service can't hang the request forever. Uses incremental
// backoff (0.5s growing to a 3s cap) and surfaces a clean apiError on timeout or
// network failure instead of an unhandled rejection.
const POLL_MAX_ELAPSED_MS = 60 * 1000; // give up after ~60s
const POLL_INITIAL_DELAY_MS = 500;
const POLL_MAX_DELAY_MS = 3000;

export const pollBatchResults = async (tokens) => {
  const start = Date.now();
  let delay = POLL_INITIAL_DELAY_MS;

  while (true) {
    let data;
    try {
      ({ data } = await axios.get(
        `${process.env.JUDGE0_URL}/submissions/batch?tokens=${tokens.join(
          ","
        )}&base64_encoded=false`,
        {
          headers: {
            "X-Auth-Token": process.env.SULU_API_TOKEN,
          },
        }
      ));
    } catch (_err) {
      // Network/HTTP error talking to Judge0 — surface as a clean gateway error.
      throw new apiError(502, "Code execution service is unavailable");
    }

    const results = data.submissions;

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
    );

    if (isAllDone) {
      return results;
    }

    if (Date.now() - start > POLL_MAX_ELAPSED_MS) {
      throw new apiError(504, "Code execution timed out. Please try again.");
    }

    await sleep(delay);
    // Incremental backoff up to the cap.
    delay = Math.min(delay * 1.5, POLL_MAX_DELAY_MS);
  }
};