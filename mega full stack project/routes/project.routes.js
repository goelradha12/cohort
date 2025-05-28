import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createProject, deleteProject, getProjectByID, getProjects, updateProject } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator } from "../validators/index.js";

const router = Router();
router.route("/").get((req,res)=>{
    console.log("connected")
    return res.status(200).json({success: true})
})

router.route("/createProject").post(isLoggedIn,createProjectValidator(),validate,createProject)
router.route("/getProjects").get(isLoggedIn,getProjects)
router.route("/deleteProject").post(isLoggedIn,deleteProject)
router.route("/getProjectByID").post(isLoggedIn,getProjectByID)
router.route("/updateProject").post(isLoggedIn,updateProject)
export default router;