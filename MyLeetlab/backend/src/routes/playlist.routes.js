import { Router } from "express";
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";
import { createPlaylistValidator } from "../validators/playlist.validators.js";
import validate from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/").get(isLoggedIn, isVerified, getAllListDetails)
router.route("/:playlistId").post(isLoggedIn, isVerified, createPlaylistValidator(), validate, createPlaylist)
    .delete(isLoggedIn, isVerified, deletePlaylist)
    .get(isLoggedIn, isVerified, getPlaylistDetails)
router.route("/:playlistId/add-problem").patch(isLoggedIn, isVerified, addProblemToPlaylist)
router.route("/:playlistId/remove-problem").patch(isLoggedIn, isVerified, removeProblemFromPlaylist)
export default router;