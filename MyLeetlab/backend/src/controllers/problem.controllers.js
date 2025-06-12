import { submitBatch } from "../libs/judge0lib.js";
import { apiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createProblem = asyncHandler(async function (req, res) {
    try {
        // get data for req
        const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets,  referenceSolutions} = req.body

        // check access
        // check is user is admin and data is valid
        const myUser = await db.User.findUnique({where: {id: req.user._id}})
        if(myUser.role !== "ADMIN")
            throw new apiError(401, "Access Denied")
        

        // loop through each reference solutions
        for(const [language, solutionCode] of Object.entries(referenceSolutions)){
            const languageID = getJudge0LanguageID(language)

            if(!languageID)
                throw new apiError(400, `${language} is not supported`)

            const submissions = testcases.map((testcase)=> {
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

            for(let i=0;i<results.length;i++){
                const result = results[i];

                if(result.status.id !==3) {
                    return res.status(400).json({
                        statusCode: 400,
                        success: false,
                        message: `Testcase ${i+1} failed for ${language}`   
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
                referenceSolutions,
                userId: myUser.id
            }
        })

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