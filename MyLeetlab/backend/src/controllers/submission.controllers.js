import { db } from "../libs/db.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js"

export const getAllSubmission = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const mySubmission = await db.Submission.findMany({
            where: {
                userId
            }
        })

        return res.status(200).json(
            new apiResponse(200, mySubmission, "All Submissions Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
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
            message: "Something went wrong while fetching submissions"
        })
    }
})

export const getSubmissionCount = asyncHandler(async (req, res) => {
    // goal: send how many users has submitted the problem 
    try {
        const problemId = req.params.problemId;
        const submissionCount = await db.Submission.count({
            where: {
                problemId
            }
        })

        res.status(200).json(
            new apiResponse(200, submissionCount, "Submission Count Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
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
            message: "Something went wrong while fetching submission count"
        })
    }
})

export const getSuccessfulSubmissionCount = asyncHandler(async (req, res) => {
    // goal: send how many users has submitted the problem successfully
    try {
        const problemId = req.params.problemId;
        const submissionCount = await db.Submission.count({
            where: {
                problemId,
                status: "ACCEPTED"
            }
        })
        // console.log(submissionCount)
        res.status(200).json(
            new apiResponse(200, submissionCount, "Submission Count Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
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
            message: "etching submission count failed"
        })
    }
})

export const getSubmissionForProblem = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const problemId = req.params.problemId;

        const mySubmission = await db.Submission.findMany({
            where: {
                userId,
                problemId
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json(
            new apiResponse(200, mySubmission, "Submission Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
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
            message: "Something went wrong while fetching submission for problem"
        })
    }
})