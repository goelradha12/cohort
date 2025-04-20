import express from "express"

// make sure to user .js in the end
import { registerUser,verifyUser,loginUser, logoutUser, forgotPassword, resetPassword, userProfile } from "../controller/user.controller.js"
import { isLoggedIn } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.get("/register",registerUser);
router.post("/register",registerUser);

router.get("/verify/:token",verifyUser);
router.post("/login",loginUser);

router.get("/logout",isLoggedIn,logoutUser);
router.post("/forgotPassword",forgotPassword);
router.post("/resetPassword/:token",resetPassword);

router.get("/userProfile",isLoggedIn,userProfile);

export default router;