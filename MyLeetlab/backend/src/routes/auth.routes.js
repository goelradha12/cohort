import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import upload from "../middlewares/multer.middlewares.js";
import { forgotPasswordRequestValidator, resendVerificationEmailValidator, resetPasswordValidator, userChangePasswordValidator, userLoginValidator, userRegistrationValidator } from "../validators/index.js"
import { changeCurrPassword, forgotPasswordRequest, getUser, loginUser, logOutUser, refreshAccessToken, registerUser, resendVerificationEmail, resetPassword, updateUserProfile, verifyMail } from "../controllers/auth.controllers.js";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
    userRegistrationValidator(),
    validate,
    // (req,res,next)=>{console.log(req.body); return next()},
    registerUser);
router.route("/verifyMail/:token").get(verifyMail);
router.route("/login").post(userLoginValidator(),validate,loginUser);
router.route("/changePassword").post(userChangePasswordValidator(),validate,changeCurrPassword);
router.route("/resendVerificationEmail").post(resendVerificationEmailValidator(),validate,resendVerificationEmail);
router.route("/forgotPassword").post(forgotPasswordRequestValidator(),validate,forgotPasswordRequest);
router.route("/resetPassword/:token").post(resetPasswordValidator(),validate,resetPassword);
router.route("/getProfile").get(isLoggedIn,getUser);
router.route("/logout").get(logOutUser);
router.route("/refreshAccessToken").get(refreshAccessToken);
router.route("/updateProfile").post(isLoggedIn,upload.single('newImage'), updateUserProfile);
export default router;