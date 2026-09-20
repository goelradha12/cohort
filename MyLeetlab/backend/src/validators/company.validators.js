import { body } from "express-validator";

export const createCompanyValidator = () => {
    return [
        body("name")
            .exists({ checkNull: true })
            .withMessage("Company name is required")
            .bail()
            .isString()
            .withMessage("Company name must be a string")
            .bail()
            .trim()
            .notEmpty()
            .withMessage("Company name cannot be empty"),
    ];
};

// Normalize a company name for canonical identity:
// trim, lowercase, and collapse consecutive whitespace.
// "Google", "google", " GOOGLE " all resolve to "google".
export const normalizeCompanyName = (value) => {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
};
