import { body } from "express-validator";

// source_code, language_id, stdin, expected_outputs, problemId
export const executeCodeValidator = () => {
  return [
    body("source_code")
      .trim()
      .notEmpty()
      .withMessage("Source Code is Required")
      .isString()
      .withMessage("Source Code must be a string"),
    body("language_id")
      .trim()
      .notEmpty()
      .withMessage("Language ID is Required"),
    body("stdin")
      .notEmpty()
      .withMessage("Stdin is Required")
      .isArray()
      .withMessage("Stdin must be an array")
      .isLength({ min: 1 })
      .withMessage("Stdin must have at least one element"),
    body("expected_outputs")
      .notEmpty()
      .withMessage("Expected Outputs is Required")
      .isArray()
      .withMessage("Expected Outputs must be an array")
      .isLength({ min: 1 })
      .withMessage("Expected Outputs must have at least one element")
      .custom((value, { req }) => {
        if (value.length !== req.body.stdin.length) {
          throw new Error("Expected Outputs and Stdin must have same length");
        }
        return true;
      }),
    body("problemId")
      .trim()
      .notEmpty()
      .withMessage("Problem ID is Required")
      .isString()
      .withMessage("Problem ID must be a string"),
  ];
};
