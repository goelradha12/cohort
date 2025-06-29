
export const getJudge0LanguageID = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language.toUpperCase()] || null;        
}

// get language name from it's ID
export const getLanguageName = (language_id) => {
  const languageName = {
    74: "TYPESCRIPT",
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return languageName[language_id] || "Unknown";
};
