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
