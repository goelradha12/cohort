import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createProject, deleteProject, getProjectByID, getProjects, updateProject } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator } from "../validators/index.js";
import { verifyMember, verifyProjectAccess, verifyUser } from "../middlewares/projectVerification.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";
import { addMemberToProject, deleteMember, getMemberByID, getProjectMembers, updateMember, updateMemberRole } from "../controllers/projectmember.controllers.js";
import { createNote, deleteNote, getNote, getNoteByID, updateNote } from "../controllers/note.controllers.js";
import { createNewTask, deleteATask, getAllTasks, getAssignedTask, getCreatedTask, getTaskByID, updateTaskStatus } from "../controllers/task.controllers.js";


const router = Router();
const projectUpdateAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];
const projectDeleteAccessList = [UserRolesEnum.ADMIN]
const projectMemberAccessList = [UserRolesEnum.ADMIN]
const projectGetMemberAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN]

router.route("/").get(isLoggedIn, verifyUser, getProjects)
router.route("/createProject").post(isLoggedIn, verifyUser, createProjectValidator(), validate, createProject)
router.route("/:projectID").get(isLoggedIn, verifyUser, getProjectByID)
router.route("/:projectID/delete").get(isLoggedIn, verifyUser, verifyProjectAccess(projectDeleteAccessList), deleteProject)
router.route("/:projectID/update").post(isLoggedIn, verifyUser, verifyProjectAccess(projectUpdateAccessList), updateProject)

router.route("/:projectID/addMember").post(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), addMemberToProject)
router.route("/:projectID/getMembers").get(isLoggedIn, verifyUser, verifyProjectAccess(projectGetMemberAccessList), getProjectMembers)

router.route("/:projectID/:memberID").get(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, getMemberByID)
router.route("/:projectID/:memberID/updateMember").post(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, updateMember)
router.route("/:projectID/:memberID/updateMemberRole").post(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, updateMemberRole)
router.route("/:projectID/:memberID/deleteMember").get(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, deleteMember)


// ------ Notes Routers -------
const getNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN]
const createNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN];

// get and create note
router.route("/:projectID/notes/getNotes").get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), getNote)
router.route("/:projectID/notes/createNote").post(isLoggedIn, verifyUser, verifyProjectAccess(createNotesAccessList), createNote);
// update and delete note
router.route("/:projectID/notes/n/:noteID").post(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), updateNote)
    .get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), getNoteByID)
    .delete(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), deleteNote);


// ------ Task Routers -------

router.route("/:projectID/tasks").get(getAllTasks)
    .post(createNewTask)

router.route("/:projectID/tasks/:taskID").get(getTaskByID)
    .delete(deleteATask)
    .patch(updateTaskStatus)

router.route("/:projectID/tasks/assigned").get(getAssignedTask)
router.route("/:projectID/tasks/created").get(getCreatedTask)
export default router;