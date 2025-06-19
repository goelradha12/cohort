import { body } from "express-validator";

export const createPlaylistValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name is Required")
            .isString()
            .withMessage("Name must be a string"),
        body("description")
            .trim()
            .optional()
            .isString()
            .withMessage("Description must be a string"),
    ];
};

export const addProblemToPlaylistValidator = () => {
    return [
        body("problemIds")
            .trim()
            .notEmpty()
            .withMessage("Problem ID is Required")
            .isArray()
            .withMessage("Problem ID must be an array")
            .isLength({ min: 1 })
            .withMessage("Problem ID must have at least one element"),
    ];
}

export const removeProblemFromPlaylistValidator = () => {
     return [
        body("problemIds")
            .trim()
            .notEmpty()
            .withMessage("Problem ID is Required")
            .isArray()
            .withMessage("Problem ID must be an array")
            .isLength({ min: 1 })
            .withMessage("Problem ID must have at least one element"),
    ];
}