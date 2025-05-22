import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";

const router = Router()
// console.log("reached successfully")
router.route("/").get(healthCheck);

export default router;