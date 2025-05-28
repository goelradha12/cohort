import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createProject, getProjects } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator } from "../validators/index.js";

const router = Router();
router.route("/").get((req,res)=>{
    console.log("connected")
    return res.status(200).json({success: true})
})

router.route("/getProjects").get(isLoggedIn,getProjects)
router.route("/createProject").post(isLoggedIn,createProjectValidator(),validate,createProject)
export default router;