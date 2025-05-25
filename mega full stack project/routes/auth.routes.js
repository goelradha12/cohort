import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import { changeCurrPassword, forgotPasswordRequest, loginUser, registerUser, resendVerificationEmail, resetPassword, verifyMail } from "../controllers/auth.controllers.js"
import { forgotPasswordRequestValidator, resendVerificationEmailValidator, resetPasswordValidator, userChangePasswordValidator, userLoginValidator, userRegistrationValidator } from "../validators/index.js"

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate,registerUser);
router.route("/verifyMail/:token").get(verifyMail);
router.route("/login").post(userLoginValidator(),validate,loginUser);
router.route("/changePassword").post(userChangePasswordValidator(),validate,changeCurrPassword);
router.route("/resendVerificationEmail").post(resendVerificationEmailValidator(),validate,resendVerificationEmail);
router.route("/forgotPassword").post(forgotPasswordRequestValidator(),validate,forgotPasswordRequest);
router.route("/resetPassword/:token").post(resetPasswordValidator(),validate,resetPassword);
export default router;