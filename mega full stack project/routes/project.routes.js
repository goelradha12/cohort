import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createProject, deleteProject, getProjectByID, getProjects, updateProject } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator } from "../validators/index.js";
import { verifyProjectAccess, verifyUser } from "../middlewares/projectVerification.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();
const projectUpdateAccessList = [UserRolesEnum.ADMIN,UserRolesEnum.PROJECT_ADMIN];
const projectDeleteAccessList = [UserRolesEnum.ADMIN]

router.route("/").get(isLoggedIn,verifyUser,getProjects)
router.route("/createProject").post(isLoggedIn,verifyUser,createProjectValidator(),validate,createProject)
router.route("/:projectID").get(isLoggedIn,verifyUser,getProjectByID)
router.route("/:projectID/delete").get(isLoggedIn,verifyUser,verifyProjectAccess(projectDeleteAccessList),deleteProject)
router.route("/:projectID/update").post(isLoggedIn,verifyUser,verifyProjectAccess(projectUpdateAccessList),updateProject)
export default router;