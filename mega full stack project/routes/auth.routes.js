import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import { changeCurrPassword, loginUser, registerUser, resendVerificationEmail, verifyMail } from "../controllers/auth.controllers.js"
import { resendVerificationEmailValidator, userChangePasswordValidator, userLoginValidator, userRegistrationValidator } from "../validators/index.js"

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate,registerUser);
router.route("/verifyMail/:token").get(verifyMail);
router.route("/login").post(userLoginValidator(),validate,loginUser);
router.route("/changePassword").post(userChangePasswordValidator(),validate,changeCurrPassword);
router.route("/resendVerificationEmail").post(resendVerificationEmailValidator(),validate,resendVerificationEmail);
export default router;