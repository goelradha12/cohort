import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { createProject, deleteProject, getProjectByID, getProjects, updateProject } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createProjectValidator, createSubtaskValidator, createTaskValidator, updateSubtaskStatusValidator, updateSubtaskValidator, updateTaskStatusValidator, updateTaskValidator } from "../validators/index.js";
import { verifyMember, verifyProjectAccess, verifySubtaskCreater, verifyTaskSpecialAccess, verifyUser } from "../middlewares/projectVerification.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";
import { addMemberToProject, deleteMember, getMemberByID, getProjectMembers, updateMember, updateMemberRole } from "../controllers/projectmember.controllers.js";
import { createNote, deleteNote, getNote, getNoteByID, updateNote } from "../controllers/note.controllers.js";
import { createNewTask, deleteATask, getAllTasks, getAssignedTask, getCreatedTask, getTaskByID, updateStatus, updateTask } from "../controllers/task.controllers.js";
import { createSubTask, deleteSubTask, getAllSubtasks, getSubtaskByID, updateSubTaskTitle, updateTaskStatus } from "../controllers/subtask.controllers.js";


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

router.route("/:projectID/m/:memberID").get(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, getMemberByID)
router.route("/:projectID/m/:memberID/updateMember").post(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, updateMember)
router.route("/:projectID/m/:memberID/updateMemberRole").post(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, updateMemberRole)
router.route("/:projectID/m/:memberID/deleteMember").get(isLoggedIn, verifyUser, verifyProjectAccess(projectMemberAccessList), verifyMember, deleteMember)


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

const taskProjectAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN];
const getAllTaskAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];
const getTaskByIDAccessList = ["assignedTo", "assignedBy", UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];
const deleteTaskAccessList = ["assignedBy", UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];
const updateTaskAccessList = ["assignedBy", "assignedTo", UserRolesEnum.ADMIN, UserRolesEnum.PROJECT_ADMIN];

router.route("/:projectID/tasks").get(isLoggedIn, verifyUser, verifyProjectAccess(getAllTaskAccessList), getAllTasks)
    .post(isLoggedIn, verifyUser, verifyProjectAccess(taskProjectAccessList), createTaskValidator(), validate, createNewTask)

router.route("/:projectID/tasks/assigned").get(isLoggedIn, verifyUser, verifyProjectAccess(taskProjectAccessList), getAssignedTask)
router.route("/:projectID/tasks/created").get(isLoggedIn, verifyUser, verifyProjectAccess(taskProjectAccessList), getCreatedTask)

router.route("/:projectID/tasks/:taskID").get(isLoggedIn, verifyUser, verifyTaskSpecialAccess(getTaskByIDAccessList), getTaskByID)
    .delete(isLoggedIn, verifyUser, verifyTaskSpecialAccess(deleteTaskAccessList), deleteATask)
    .patch(isLoggedIn, verifyUser, verifyTaskSpecialAccess(updateTaskAccessList), updateTaskValidator(), validate, updateTask)

router.route("/:projectID/tasks/:taskID/updateStatus").patch(isLoggedIn, verifyUser, verifyProjectAccess(taskProjectAccessList), updateTaskStatusValidator(), validate, updateStatus)


// ------ Subtask Routers ------ 


router.route("/:projectID/tasks/:taskID/subtasks")
    .get(isLoggedIn, verifyUser, verifyTaskSpecialAccess(getTaskByIDAccessList), getAllSubtasks)
    .post(isLoggedIn, verifyUser, verifyTaskSpecialAccess(getTaskByIDAccessList),verifyProjectAccess(taskProjectAccessList), createSubtaskValidator(), validate,  createSubTask)

router.route("/:projectID/tasks/:taskID/subtasks/:subTaskID")
    .get(isLoggedIn, verifyUser, verifyTaskSpecialAccess(getTaskByIDAccessList), getSubtaskByID)
    .patch(isLoggedIn, verifyUser, verifySubtaskCreater, updateSubtaskValidator(), validate, updateSubTaskTitle)
    .delete(isLoggedIn, verifyUser, verifySubtaskCreater, deleteSubTask)

router.route("/:projectID/tasks/:taskID/subtasks/:subTaskID/status")
    .patch(isLoggedIn, verifyUser, verifySubtaskCreater, updateSubtaskStatusValidator(), validate, updateTaskStatus)
export default router;