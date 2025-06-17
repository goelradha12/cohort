import {body} from "express-validator";

export const createProblemValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is Required")
            ,
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is Required")
            ,
        body("difficulty")
        .trim()
        .optional()
        .isIn(["EASY","MEDIUM","HARD"])
        .withMessage("Difficulty must be one of EASY, MEDIUM, HARD"),
        body("tags")
        .trim()
        .notEmpty()
        .withMessage("Tags is Required")
        .isString()
        .withMessage("Tags must be a string"),
        body("examples")
        .trim()
        .notEmpty()
        .withMessage("Examples is Required"),
        body("constraints")
        .trim()
        .notEmpty()
        .withMessage("Constraints is Required")
        .isString()
        .withMessage("Constraints must be a string"),
        body("testcases")
        .trim()
        .notEmpty()
        .withMessage("Testcases are required"),
        body("codeSnippets")
        .trim()
        .notEmpty()
        .withMessage("CodeSnippets is Required")
        .isJSON()
        .withMessage("JSON format is required for codeSnippet"),
        body("referenceSolutions")
        .trim()
        .notEmpty()
        .withMessage("referenceSolutions is Required")
        .isJSON()
        .withMessage("JSON format is required for referenceSolutions")
    ]
}