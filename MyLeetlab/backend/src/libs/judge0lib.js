import axios from "axios";

// Convert language name to CodeBox/Judge0 language ID
export const getJudge0LanguageID = (language) => {
  const languageMap = {
    C: 50,
    CPP: 54,
    "C++": 54,
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    JS: 63,
  };

  return languageMap[language.toUpperCase()] || null;
};

// Get language name from language ID
export const getLanguageName = (language_id) => {
  const languageName = {
    50: "C",
    54: "CPP",
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return languageName[language_id] || "Unknown";
};

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

  console.info("Judge0 batch submitted", {
    submissionCount: Array.isArray(data) ? data.length : 0,
    responseType: Array.isArray(data) ? "array" : typeof data,
  });
  return data;
};

// Poll until all submissions are completed
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch?tokens=${tokens.join(
        ","
      )}&base64_encoded=false`,
      {
        headers: {
          "X-Auth-Token": process.env.SULU_API_TOKEN,
        },
      }
    );

    const results = data.submissions;

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
    );

    if (isAllDone) {
      return results;
    }

    // Wait one second before polling again
    await sleep(1000);
  }
};