import { db } from "../libs/db.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0lib.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js"
import { asyncHandler } from "../utils/async-handler.js";

export const executeCode = asyncHandler(async function (req, res) {
    // goal: execute code, 1. if correct: mark as done, 2. store a submission,
    // 3. Store testcase result of that submission

    try {
        const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;

        const userId = req.user._id;
        // already validated

        // prepare each test case for judge0 submission
        const submission = stdin.map((input) => {
            return {
                source_code,
                language_id,
                stdin: input
            }
        })

        const submissionResult = await submitBatch(submission);
        const tokens = submissionResult.map((res) => res.token);

        // wait till all are executed, and get outputs
        const results = await pollBatchResults(tokens);

        // validate if all testcases are passed
        // console.log("\n-------results-------\n", results)
        let allPassed = true;
        const detailedResults = results.map((result, index) => {
            const stdout = result.stdout?.trim();
            const expectedOutput = expected_outputs[index].trim();
            const passed = stdout === expectedOutput;
            if (!passed) {
                allPassed = false;
            }

            // we are prepareing our testcase result
            return {
                testCase: index + 1,
                passed,
                stdout,
                expected: expectedOutput,
                stderr: result.stderr?.trim() || null,
                compile_output: result.compile_output?.trim() || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined,
            }
        })

        const submissionDoc = await db.Submission.create({
            data: {
                userId,
                problemId,
                language: getLanguageName(language_id),
                sourceCode: source_code,
                status: allPassed ? "ACCEPTED" : "WRONG ANSWER",
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailedResults.map((result) => result.stdout)),
                stderr: detailedResults.some((result) => result.stderr) ? JSON.stringify(detailedResults.map((result) => result.stderr)) : null,
                compileOutput: detailedResults.some((result) => result.compile_output) ? JSON.stringify(detailedResults.map((result) => result.compile_output)) : null,
                memory: detailedResults.some((result) => result.memory) ? JSON.stringify(detailedResults.map((result) => result.memory)) : null,
                time: detailedResults.some((result) => result.time) ? JSON.stringify(detailedResults.map((result) => result.time)) : null
            }
        })

        // if all testcase are passed, store the problem as solved for the user
        if(allPassed) {
            await db.ProblemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId,
                        problemId
                    }
                },
                update: {},
                create: {
                    userId,
                    problemId
                }
            })
        }

        // store testcaseResult
        const testcaseResults = detailedResults.map((result) => {
            return {
                submissionId: submissionDoc.id,
                testCase: result.testCase,
                passed: result.passed,
                stdout: result.stdout,
                expected: result.expected,
                stderr: result.stderr,
                compileOutput: result.compile_output,
                status: result.status,
                memory: result.memory,
                time: result.time
            }
        })

        await db.TestCaseResult.createMany({
            data: testcaseResults
        })

        return res.status(200).json(
            new apiResponse(
                200,
                {
                    submission: submissionDoc,
                    TestCaseResult: testcaseResults
                }
                ,
                "Code Executed Successfully"
            )
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
            message: "Something went wrong while code execution",    
        })
    }
})