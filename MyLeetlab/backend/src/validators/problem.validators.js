import {body} from "express-validator";

export const createProblemValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is Required")
            .isString()
            .withMessage("Title must be a string"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description is Required")
            .isString()
            .withMessage("Description must be a string"),
        body("difficulty")
        .trim()
        .optional()
        .isIn(["EASY","MEDIUM","HARD"])
        .withMessage("Difficulty must be one of EASY, MEDIUM, HARD"),
        body("tags")
        .trim()
        .notEmpty()
        .withMessage("Tags is Required")
        .isArray()
        .withMessage("Tags must be a string"),
        body("examples")
        .notEmpty()
        .withMessage("Examples is Required"),
        body("constraints")
        .trim()
        .notEmpty()
        .withMessage("Constraints is Required")
        .isString()
        .withMessage("Constraints must be a string"),
        body("testcases")
        .notEmpty()
        .withMessage("Testcases are required"),
        body("codeSnippets")
        .notEmpty()
        .withMessage("CodeSnippets is Required"),
        body("referenceSolutions")
        .notEmpty()
        .withMessage("referenceSolutions is Required")
    ]
}