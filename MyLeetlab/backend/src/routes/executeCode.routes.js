import express from "express";
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { executeCode, runCode } from "../controllers/executeCode.controllers.js";
import { executeCodeValidator } from "../validators/executeCode.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = express.Router();

router.route("/").post(isLoggedIn, isVerified, executeCodeValidator(), validate, executeCode)
router.route("/run").post(isLoggedIn, isVerified, executeCodeValidator(), validate, runCode)

export default router;