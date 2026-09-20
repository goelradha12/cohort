import { Router } from "express";
import { isLoggedIn, isVerified, checkAdmin } from "../middlewares/auth.middlewares.js";
import { getAllCompanies, createCompany } from "../controllers/company.controllers.js";
import { createCompanyValidator } from "../validators/company.validators.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/")
    // Any verified user can read the canonical company list (for filters + display).
    .get(isLoggedIn, isVerified, getAllCompanies)
    // Only admins can create companies.
    .post(isLoggedIn, checkAdmin, createCompanyValidator(), validate, createCompany);

export default router;
