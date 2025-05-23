import { Router } from "express"
import { validate } from "../middlewares/validator.middleware.js"
import { registerUser, verifyMail } from "../controllers/auth.controllers.js"
import { userRegistrationValidator } from "../validators/index.js"

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate,registerUser);
router.route("/verifyMail/:token").get(verifyMail);
export default router;