import { body } from "express-validator";

export const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid")
      .toLowerCase(),
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
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid"),
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
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid"),
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
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is Required")
]}

export const forgotPasswordRequestValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is Required")
      .isEmail()
      .withMessage("Email is Invalid")
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
