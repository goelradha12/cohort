import { Router } from "express"
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { getAllSubmission, getSubmissionCount, getSubmissionForProblem } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/").get(isLoggedIn, isVerified, getAllSubmission);
router.route("/get-submission-count/:problemId").get(isLoggedIn, isVerified, getSubmissionCount)
router.route("/:problemId").get(isLoggedIn, isVerified, getSubmissionForProblem)
export default router;