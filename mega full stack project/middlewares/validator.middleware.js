import { validationResult } from "express-validator";
import {ApiError} from "../utils/api.error.js";

export const validate = (req,res,next) => {
    // get error found in validator
    const errors = validationResult(req) 
    if(errors.isEmpty()) 
        return next()
    else
    {
        const extractedError = errors.array().map((err) => {
            return {[err.path]: err.msg}
        })
        throw new ApiError(422,"Recieved data is not valid",extractedError);
    }
}
