import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth.middlewares";
import { verifyProjectAccess, verifyUser } from "../middlewares/projectVerification.middlewares";
import { UserRolesEnum } from "../utils/constants";
import { createNote, deleteNote, getNote, updateNote } from "../controllers/note.controllers";

const router = Router();
const getNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN]
const createNotesAccessList = [UserRolesEnum.ADMIN, UserRolesEnum.MEMBER, UserRolesEnum.PROJECT_ADMIN];

router.route("/").get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), getNote);
router.route("/createNote").post(isLoggedIn, verifyUser, verifyProjectAccess(createNotesAccessList), createNote);
router.route("/:noteID/update").post(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), updateNote);
router.route("/:noteID/delete").get(isLoggedIn, verifyUser, verifyProjectAccess(getNotesAccessList), deleteNote);

export default router;