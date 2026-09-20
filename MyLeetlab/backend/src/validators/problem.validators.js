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
        .withMessage("referenceSolutions is Required"),
        // companies is optional; if present it must be an array.
        body("companies")
        .optional()
        .isArray()
        .withMessage("Companies must be an array"),
        // When companies exists, every entry must have all three fields.
        body("companies.*.companyId")
        .exists({ checkNull: true })
        .withMessage("companyId is required for each company entry")
        .bail()
        .isString()
        .withMessage("companyId must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("companyId cannot be empty"),
        body("companies.*.year")
        .exists({ checkNull: true })
        .withMessage("year is required for each company entry")
        .bail()
        .isInt({ min: 1970, max: new Date().getFullYear() + 1 })
        .withMessage(`year must be an integer between 1970 and ${new Date().getFullYear() + 1}`)
        .toInt(),
        body("companies.*.context")
        .exists({ checkNull: true })
        .withMessage("context is required for each company entry")
        .bail()
        .isString()
        .withMessage("context must be a string")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("context cannot be empty"),
    ]
}