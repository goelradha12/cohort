import { pollBatchResults, submitBatch } from "../libs/judge0lib";
import { apiError } from "../utils/api.error";
import { asyncHandler } from "../utils/async-handler";

export const executeCode = asyncHandler(async function (req, res) {
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