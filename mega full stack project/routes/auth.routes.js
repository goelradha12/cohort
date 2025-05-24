import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import { loginUser, registerUser, verifyMail } from "../controllers/auth.controllers.js"
import { userRegistrationValidator } from "../validators/index.js"

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate,registerUser);
router.route("/verifyMail/:token").get(verifyMail);
router.route("/login").post(loginUser);
export default router;