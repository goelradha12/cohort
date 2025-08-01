import { db } from "../libs/db.js";
import { getJudge0LanguageID, pollBatchResults, submitBatch } from "../libs/judge0lib.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createProblem = asyncHandler(async function (req, res) {
    try {
        // get data for req
        const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, hints, editorial } = req.body

        // check access
        // check is user is admin and data is valid
        const myUser = await db.User.findUnique({ where: { id: req.user._id } })
        if (myUser.role !== "ADMIN")
            throw new apiError(401, "Access Denied")


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
            console.log("\n-------results-------\n", results)
            for (let i = 0; i < results.length; i++) {
                // console.log("-------result-------", results[i])
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
                userId: myUser.id
            }
        })

        return res.status(200).json(
            new apiResponse(200, newProblem, "Problem Created Successfully")
        )

    } catch (error) {
        console.log(error)
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
        return res.status(200).json(
            new apiResponse(200, problems, "All Problems Fetched Successfully")
        )
    } catch (error) {
        console.log(error)
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
        return res.status(200).json(
            new apiResponse(200, problem, "Problem Fetched Successfully")
        )
    } catch (error) {
        console.log(error)
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
        const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, hints, editorial } = req.body

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
                    console.log("-------result-------", results[i])
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


        const updatedProblem = await db.Problem.update({
            where: {
                id: problem.id
            },
            data: {
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
        })

        return res.status(200).json(
            new apiResponse(200, updatedProblem, "Problem Updated Successfully"))
    } catch (error) {
        console.log(error)
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
        console.log(error)
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
        console.log(erorrs)
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