import { Router } from "express";
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";
import { addProblemToPlaylistValidator, createPlaylistValidator, removeProblemFromPlaylistValidator } from "../validators/playlist.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/")
    .get(isLoggedIn, isVerified, getAllListDetails)
    .post(isLoggedIn, isVerified, createPlaylistValidator(), validate, createPlaylist)

router.route("/:playlistId")
    .delete(isLoggedIn, isVerified, deletePlaylist)
    .get(isLoggedIn, isVerified, getPlaylistDetails)

router.route("/:playlistId/add-problem")
    .post(isLoggedIn, isVerified, addProblemToPlaylistValidator(), validate, addProblemToPlaylist)

router.route("/:playlistId/remove-problem")
    .delete(isLoggedIn, isVerified, removeProblemFromPlaylistValidator(), validate, removeProblemFromPlaylist)

export default router;