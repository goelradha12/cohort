import express from "express";
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { executeCode, runCode } from "../controllers/executeCode.controllers.js";
import { executeCodeValidator } from "../validators/executeCode.validators.js";
import { validate } from "../middlewares/validator.middleware.js";
import { executionRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = express.Router();

// executionRateLimiter runs after isLoggedIn so it can key on req.user._id (3/min per user).
router.route("/").post(isLoggedIn, isVerified, executionRateLimiter, executeCodeValidator(), validate, executeCode)
router.route("/run").post(isLoggedIn, isVerified, executionRateLimiter, executeCodeValidator(), validate, runCode)

export default router;