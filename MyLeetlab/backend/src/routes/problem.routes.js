import express from "express"
import { checkAdmin, isLoggedIn, isVerified } from "../middlewares/auth.middlewares"
import { createProblem, deleteProblem, getAllProblems, getProblemByID, updateProblem } from "../controllers/problem.controllers"

const router = express.Router()

router.route("/").get(isLoggedIn,isVerified,getAllProblems)
router.route("/create-problem").post(isLoggedIn,checkAdmin,createProblem)
router.route("/:id").get(isLoggedIn,isVerified,getProblemByID)
        .put(isLoggedIn,checkAdmin,updateProblem)
        .delete(isLoggedIn,checkAdmin,deleteProblem)
router.route("/get-solved-problems").get(isLoggedIn,isVerified,getAllProblemsSolvedByUser)

export default router
