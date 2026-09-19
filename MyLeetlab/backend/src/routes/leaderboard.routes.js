import { Router } from "express";
import { isLoggedIn, isVerified } from "../middlewares/auth.middlewares.js";
import { getLeaderboard } from "../controllers/leaderboard.controllers.js";

const router = Router();

// Public to all verified, logged-in users so a batch can see each other's progress.
router.route("/").get(isLoggedIn, isVerified, getLeaderboard);

export default router;
