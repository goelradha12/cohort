import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares.js";
import { verifyProjectAccess, verifyUser } from "../middlewares/projectVerification.middlewares.js";
import { UserRolesEnum } from "../utils/constants.js";
import { createNote, deleteNote, getNote, updateNote } from "../controllers/note.controllers.js";

const router = Router();

const getNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN]
const createNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN];

// get and create note
router.route("/").get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), getNote)
    .post(isLoggedIn, verifyUser, verifyProjectAccess(createNotesAccessList), createNote);
// update and delete note
router.route("/n/:noteID").post(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), updateNote)
    .get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), deleteNote);

export default router;