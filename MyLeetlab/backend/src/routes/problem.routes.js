import express from "express"
import { checkAdmin, isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js"
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemByID, updateProblem } from "../controllers/problem.controllers.js"
import { validate } from "../middlewares/validator.middleware.js"
import { createProblemValidator } from "../validators/problem.validators.js"

const router = express.Router()

router.route("/").get(isLoggedIn, isVerified, getAllProblems)
router.route("/create-problem").post(isLoggedIn, checkAdmin, createProblemValidator(), validate, createProblem)
router.route("/:id").get(isLoggedIn, isVerified, getProblemByID)
        .put(isLoggedIn, checkAdmin, createProblemValidator(), validate, updateProblem)
        .delete(isLoggedIn, checkAdmin, deleteProblem)
router.route("/get-solved-problems").get(isLoggedIn, isVerified, getAllProblemsSolvedByUser)

export default router
