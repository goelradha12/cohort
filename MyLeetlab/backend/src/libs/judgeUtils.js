// Shared execution/judging helpers used by executeCode and runCode.

// Canonical submission status values.
// IMPORTANT: The frontend compares `submission.status === "ACCEPTED"` and also
// renders the raw string (SubmissionResult.jsx, SubmissionList.jsx, Profile.jsx).
// Keep these exact values to avoid breaking the UI.
export const SUBMISSION_STATUS = Object.freeze({
    ACCEPTED: "ACCEPTED",
    WRONG_ANSWER: "WRONG ANSWER",
});

/**
 * Normalize a program's textual output for comparison in a LeetCode-style judge.
 *
 * Handles the common formatting differences that should NOT cause a wrong answer:
 * - CRLF / CR line endings are normalized to LF.
 * - Trailing whitespace on each line is stripped.
 * - Trailing blank lines at the end of the output are dropped.
 * Leading/interior blank lines and intra-line spacing are preserved, because for
 * many problems they are significant (e.g. matrix rows, formatted output).
 *
 * @param {string | null | undefined} value raw stdout or expected output
 * @returns {string} normalized string safe for exact comparison
 */
export const normalizeOutput = (value) => {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/\r\n?/g, "\n")        // CRLF or lone CR -> LF
        .split("\n")
        .map((line) => line.replace(/\s+$/, "")) // strip trailing whitespace per line
        .join("\n")
        .replace(/\n+$/, "");           // drop trailing blank lines
};

/**
 * Compare actual output against expected output for a single testcase.
 *
 * Comparison order:
 * 1. Normalized exact string match (covers strings, booleans, and formatted text).
 * 2. Numeric comparison fallback: if both sides are single numeric tokens, compare
 *    them as numbers so "0.5" == "0.50" and "3" == "3.0". A small epsilon is used
 *    for floating point. This only applies when BOTH sides are single numbers, so
 *    it never loosens comparison for non-numeric answers.
 *
 * @param {string} actual raw program stdout
 * @param {string} expected raw expected output
 * @returns {boolean} whether the testcase passes
 */
export const outputsMatch = (actual, expected) => {
    const a = normalizeOutput(actual);
    const e = normalizeOutput(expected);

    if (a === e) return true;

    // Numeric tolerance fallback: only when both are a single numeric token.
    const numA = Number(a);
    const numE = Number(e);
    const bothSingleNumbers =
        a !== "" &&
        e !== "" &&
        !a.includes("\n") &&
        !e.includes("\n") &&
        !Number.isNaN(numA) &&
        !Number.isNaN(numE);

    if (bothSingleNumbers) {
        const epsilon = 1e-9;
        return Math.abs(numA - numE) <= epsilon * Math.max(1, Math.abs(numE));
    }

    return false;
};
