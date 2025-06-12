export const getJudge0LanguageID = (language) => {
    const languageMap = {
        "PYTHON": 71,
        "JAVA": 62,
        "JAVASCRIPT": 63,
    }
    return languageMap[language.toUpperCase()] || null;        
}

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });}
export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`, {submissions});

    console.log("Submission Results: ", data);
    return data;
}

export const pollBatchResults = async (tokens) => {
    while(true)
    {
        const {data} = await axios.get(`${process.env.JUDGE0_URL}/submissions/batch?tokens=${tokens.join(",")}&base64_encoded=false`)

        const results = data.submissions;

        const isAllDone = results.every((result) => result.status !== 1 && result.status !== 2)
        
        if(isAllDone) return results

        // before checking again, wait for 1 second
        await sleep(1000)
    }
}