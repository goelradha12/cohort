import { Router } from "express"
import { validate } from "../middlewares/validator.middleware"
import { registerUser } from "../controllers/auth.controllers"
import { userRegistrationValidator } from "../validators"

const router = Router();

router.route("/register").post(userRegistrationValidator(),validate,registerUser);

export default router;