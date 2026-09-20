import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { getSupportedLanguages } from "../controllers/language.controllers.js";

const router = Router();

// Any logged-in user can read the supported-language list (used by the admin
// form's language selector and, indirectly, the problem UI).
router.route("/").get(isLoggedIn, getSupportedLanguages);

export default router;
