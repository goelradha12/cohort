import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import upload from "../middlewares/multer.middlewares.js";
import { forgotPasswordRequestValidator, resendVerificationEmailValidator, resetPasswordValidator, userChangePasswordValidator, userLoginValidator, userRegistrationValidator } from "../validators/auth.validators.js"
import { changeCurrPassword, forgotPasswordRequest, getUser, loginUser, logOutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, updateUserProfile, verifyMail } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// authRateLimiter (10 requests / 15 min per IP) guards the sensitive, pre-auth endpoints.
router.route("/register").post(
    authRateLimiter,
    userRegistrationValidator(),
    validate,
    registerUser);
router.route("/verifyMail/:token").get(verifyMail);
router.route("/login").post(authRateLimiter,userLoginValidator(),validate,loginUser);
router.route("/changePassword").post(userChangePasswordValidator(),validate,changeCurrPassword);
router.route("/resendVerificationEmail").post(authRateLimiter,resendVerificationEmailValidator(),validate,resendVerificationEmail);
router.route("/forgotPassword").post(authRateLimiter,forgotPasswordRequestValidator(),validate,forgotPasswordRequest);
router.route("/resetPassword/:token").post(authRateLimiter,resetPasswordValidator(),validate,resetPassword);
router.route("/getProfile").get(isLoggedIn,getUser);
router.route("/logout").get(logOutUser);
router.route("/refreshAccessToken").get(refreshAccessToken);
router.route("/updateProfile").post(isLoggedIn,upload.single('newImage'), updateUserProfile);
export default router;