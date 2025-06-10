import { asyncHandler } from "../utils/async-handler";

export const createProblem = asyncHandler(async function (req, res) {
    try {
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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
export const getProblemByID = asyncHandler(async function (req, res) {
    try {
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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
export const getAllProblemsSolvedByUser = asyncHandler(async function (req, res) {
    try {
        
    } catch (error) {
        console.log(erorrs)
        if(error instanceof apiError){
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