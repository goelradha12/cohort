import { db } from "../libs/db.js";
import { getJudge0LanguageID, pollBatchResults, submitBatch, isSupportedLanguage } from "../libs/judge0lib.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

const assertCompanyIdsExist = async (companies) => {
    if (!Array.isArray(companies) || companies.length === 0) return;

    const ids = [...new Set(companies.map((entry) => entry.companyId))];
    const found = await db.Company.findMany({
        where: { id: { in: ids } },
        select: { id: true },
    });
    const foundIds = new Set(found.map((c) => c.id));
    const missing = ids.filter((id) => !foundIds.has(id));

    if (missing.length > 0) {
        throw new apiError(400, `Unknown companyId(s): ${missing.join(", ")}`);
    }
};

// Validate the per-language JSON maps: at least one language, every key must be a
// supported language, and codeSnippets / referenceSolutions must cover the same
// languages (the backend executes each reference solution). Throws apiError 400.
const assertValidLanguages = (codeSnippets, referenceSolutions) => {
    const snippetLangs = Object.keys(codeSnippets || {});
    const solutionLangs = Object.keys(referenceSolutions || {});

    if (snippetLangs.length === 0 || solutionLangs.length === 0) {
        throw new apiError(400, "At least one language is required");
    }

    const unsupported = [...new Set([...snippetLangs, ...solutionLangs])].filter(
        (lang) => !isSupportedLanguage(lang)
    );
    if (unsupported.length > 0) {
        throw new apiError(400, `Unsupported language(s): ${unsupported.join(", ")}`);
    }

    // Every language with a starter snippet must also have a reference solution.
    const missingSolutions = snippetLangs.filter((lang) => !solutionLangs.includes(lang));
    if (missingSolutions.length > 0) {
        throw new apiError(400, `Missing reference solution for: ${missingSolutions.join(", ")}`);
    }
};

export const createProblem = asyncHandler(async function (req, res) {
    try {
        // get data for req
        const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, hints, editorial, companies } = req.body

        // check access
        // check is user is admin and data is valid
        const myUser = await db.User.findUnique({ where: { id: req.user._id } })
        if (myUser.role !== "ADMIN")
            throw new apiError(401, "Access Denied")

        // Verify referenced companies exist (no DB FK on the JSON column).
        await assertCompanyIdsExist(companies)

        // Validate language keys (>=1, all supported, snippets+solutions aligned).
        assertValidLanguages(codeSnippets, referenceSolutions)

        // loop through each reference solutions
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageID = getJudge0LanguageID(language)

            if (!languageID)
                throw new apiError(400, `${language} is not supported`)

            const submissions = testcases.map((testcase) => {
                const input = testcase.input
                const output = testcase.output

                return {
                    source_code: solutionCode,
                    language_id: languageID,
                    stdin: input,
                    expected_output: output
                }
            })

            const submissionResults = await submitBatch(submissions)

            const tokens = submissionResults.map((res) => res.token)

            // wait till all are executed
            const results = await pollBatchResults(tokens)

            // validate if all testcases are passed
            console.info("Reference solution execution completed", {
                language,
                testcaseCount: results.length,
                failedCount: results.filter((result) => result.status?.id !== 3).length,
            })
            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: `Testcase ${i + 1} failed for ${language}`
                    })
                }

            }
        }

        // save the problem to db now
        const newProblem = await db.Problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                testcases,
                codeSnippets,
                editorial,
                hints,
                referenceSolutions,
                companies: Array.isArray(companies) ? companies : [],
                userId: myUser.id
            }
        })

        return res.status(200).json(
            new apiResponse(200, newProblem, "Problem Created Successfully")
        )

    } catch (error) {
        console.error("Problem creation failed", {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})
export const getAllProblems = asyncHandler(async function (req, res) {
    try {
        const problems = await db.Problem.findMany()

        if (!problems)
            throw new apiError(404, "No Problems Found")

        // The list view never needs reference solutions; strip them so they are
        // not exposed to clients.
        const sanitized = problems.map(({ referenceSolutions, ...rest }) => rest)

        return res.status(200).json(
            new apiResponse(200, sanitized, "All Problems Fetched Successfully")
        )
    } catch (error) {
        console.error("Problem list fetch failed", {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while fetching problems",
        })
    }
})
export const getProblemByID = asyncHandler(async function (req, res) {
    try {
        const { id } = req.params;
        if (!id)
            throw new apiError(400, "Problem ID is required")

        const problem = await db.Problem.findUnique({
            where: {
                id
            }
        })
        if (!problem)
            throw new apiError(404, "Problem Not Found")

        // Reference solutions must not leak to users who haven't earned them.
        // Reveal the actual solution code only to admins or users who have solved
        // this problem. For everyone else, keep the language keys (so the UI can
        // still show which languages have a solution, locked) but null the code.
        const requester = await db.User.findUnique({ where: { id: req.user._id } })
        const isAdmin = requester?.role === "ADMIN"

        let hasSolved = false
        if (!isAdmin) {
            const solved = await db.ProblemSolved.findUnique({
                where: { userId_problemId: { userId: req.user._id, problemId: id } },
            })
            hasSolved = Boolean(solved)
        }

        let responseProblem = problem
        if (!isAdmin && !hasSolved && problem.referenceSolutions && typeof problem.referenceSolutions === "object") {
            const lockedSolutions = Object.fromEntries(
                Object.keys(problem.referenceSolutions).map((lang) => [lang, null])
            )
            responseProblem = { ...problem, referenceSolutions: lockedSolutions }
        }

        return res.status(200).json(
            new apiResponse(200, responseProblem, "Problem Fetched Successfully")
        )
    } catch (error) {
        console.error("Problem fetch failed", {
            problemId: req.params.id,
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})
export const updateProblem = asyncHandler(async function (req, res) {
    try {
        // get all the data
        const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, hints, editorial, companies } = req.body

        // check if problem exists
        if(!req.params.id)
            throw new apiError(400, "Problem ID is required")

        const problem = await db.Problem.findUnique({
            where: {
                id: req.params.id
            }
        })
        if (!problem)
            throw new apiError(404, "Problem Not Found")

        // check access
        // check is user is admin and data is valid
        const myUser = await db.User.findUnique({ where: { id: req.user._id } })
        if (myUser.role !== "ADMIN")
            throw new apiError(401, "Access Denied")


        // loop through each reference solutions
        if (testcases || referenceSolutions) {

            // Validate language keys (>=1, all supported, snippets+solutions aligned).
            assertValidLanguages(codeSnippets, referenceSolutions)

            for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
                const languageID = getJudge0LanguageID(language)

                if (!languageID)
                    throw new apiError(400, `${language} is not supported`)

                const submissions = testcases.map((testcase) => {
                    const input = testcase.input
                    const output = testcase.output

                    return {
                        source_code: solutionCode,
                        language_id: languageID,
                        stdin: input,
                        expected_output: output
                    }
                })

                const submissionResults = await submitBatch(submissions)

                const tokens = submissionResults.map((res) => res.token)

                // wait till all are executed
                const results = await pollBatchResults(tokens)

                // validate if all testcases are passed

                for (let i = 0; i < results.length; i++) {
                    const result = results[i];

                    if (result.status.id !== 3) {
                        return res.status(400).json({
                            statusCode: 400,
                            success: false,
                            message: `Testcase ${i + 1} failed for ${language}`
                        })
                    }

                }
            }
        }


        const updateData = {
            title,
            description,
            difficulty,
            tags,
            examples,
            constraints,
            testcases,
            codeSnippets,
            referenceSolutions,
            hints,
            editorial,
            userId: myUser.id
        }

        // Only touch companies when the client explicitly sent the field.
        //   undefined -> leave the existing value untouched
        //   []        -> explicitly clear all company entries
        if (companies !== undefined) {
            await assertCompanyIdsExist(companies)
            updateData.companies = companies
        }

        const updatedProblem = await db.Problem.update({
            where: {
                id: problem.id
            },
            data: updateData
        })

        return res.status(200).json(
            new apiResponse(200, updatedProblem, "Problem Updated Successfully"))
    } catch (error) {
        console.error("Problem update failed", {
            problemId: req.params.id,
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})
export const deleteProblem = asyncHandler(async function (req, res) {
    try {
        const { id } = req.params;
        if (!id)
            throw new apiError(400, "Problem ID is required")

        const problem = await db.Problem.findUnique({
            where: {
                id
            }
        })
        if (!problem)
            throw new apiError(404, "Problem Not Found")

        await db.Problem.delete({
            where: { id }
        })

        return res.status(200).json(
            new apiResponse(200, {}, "Problem Deleted Successfully")
        )
    } catch (error) {
        console.error("Problem deletion failed", {
            problemId: req.params.id,
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while delting problem",
        })
    }
})
export const getAllProblemsSolvedByUser = asyncHandler(async function (req, res) {
    try {
        const userId = req.user._id;
        const mySolvedProblems = await db.ProblemSolved.findMany({
            where: {
                userId
            },
            include: {
                problem: true
            }
        })

        return res.status(200).json(
            new apiResponse(200, mySolvedProblems, "All Problems Fetched Successfully")
        )
    } catch (error) {
        console.error("Solved-problem lookup failed", {
            name: erorrs.name,
            message: erorrs.message,
            code: erorrs.code,
            statusCode: erorrs.statusCode,
            stack: erorrs.stack,
        })
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})