import { body } from "express-validator";
import { AvailableTaskStatus } from "../utils/constants.js";

export const userRegistrationValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is Required")
      .isLength({ min: 3 })
      .withMessage("Atleast 3 digits are Required")
      .isLength({ max: 13 })
      .withMessage("Maximum 13 digits Allowed"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid"),
    body("password")
      .notEmpty()
      .withMessage("Password is Required")
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ];
};

export const userLoginValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("password")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ];
};

export const userChangePasswordValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("oldPassword")
      .trim()
      .notEmpty()
      .withMessage("Old Password is required"),
    body("newPassword")
      .notEmpty()
      .withMessage("New Password is Required")
      .isLength({ min: 6 })
      .withMessage("Atleast 6 digits are Required")
      .isLength({ max: 25 })
      .withMessage("Maximum 25 digits Allowed"),
  ]
}

export const resendVerificationEmailValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is Required")
]}

export const forgotPasswordRequestValidator = () => {
  return [
    body("email")
      .trim(),
    body("username")
      .trim(),
  ]
}

export const resetPasswordValidator = () => {
  return [
    body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("Password is Required")
  ]
}

export const createProjectValidator = () => {
  return [
    body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is Required")
  ]
}

export const createTaskValidator = () => {
  return [
    body("title")
    .notEmpty()
    .withMessage("Title is Required")
    .isLength({max:100})
    .withMessage("Max 100 char are allowed")
    .isString()
    .withMessage("String format is required"),
    body("assignedToUsername")
    .notEmpty()
    .withMessage("Mention to whom this task is assigned"),
    body("description")
    .optional()
    .isLength({max:1000})
    .withMessage("Max 1000 char are allowed"),
    body("status")
    .optional()
    .isIn(AvailableTaskStatus)
    .withMessage("Invalid value recieved")
  ]
}

export const updateTaskStatusValidator = () => {
  return [
    body("status")
    .notEmpty()
    .withMessage("Status value is required")
    .isIn(AvailableTaskStatus)
    .withMessage("Invalid value recieved")
  ]
}

export const updateTaskValidator = () => {
  return [
    body("newTitle")
    .optional()
    .isLength({max:100})
    .withMessage("Max 100 char are allowed")
    .isString()
    .withMessage("String format is required"),
    body("newDescription")
    .optional()
    .isLength({max:1000})
    .withMessage("Max 1000 char are allowed")
  ]
}