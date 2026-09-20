import { db } from "../libs/db.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { normalizeCompanyName } from "../validators/company.validators.js";

// List all companies (canonical directory), sorted by display name.
// Available to any verified, logged-in user so the frontend can build the
// companyId -> name map and filter options.
export const getAllCompanies = asyncHandler(async (req, res) => {
    try {
        const companies = await db.Company.findMany({
            orderBy: { name: "asc" },
            select: { id: true, name: true },
        });

        return res.status(200).json(
            new apiResponse(200, companies, "Companies fetched successfully")
        );
    } catch (error) {
        console.error("Company list fetch failed", {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        });
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while fetching companies",
        });
    }
});

// Create a company (admin-only via route guard). Normalizes the name and
// find-or-creates by normalizedName, so "Google", "google", " GOOGLE " all
// resolve to the same canonical company. Returns the existing or new record.
export const createCompany = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        const normalizedName = normalizeCompanyName(name);

        if (!normalizedName) {
            throw new apiError(400, "Company name cannot be empty");
        }

        const existing = await db.Company.findUnique({
            where: { normalizedName },
        });

        if (existing) {
            return res.status(200).json(
                new apiResponse(200, existing, "Company already exists")
            );
        }

        const company = await db.Company.create({
            data: {
                name: name.trim(),
                normalizedName,
            },
        });

        return res.status(201).json(
            new apiResponse(201, company, "Company created successfully")
        );
    } catch (error) {
        console.error("Company creation failed", {
            name: error.name,
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            stack: error.stack,
        });
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while creating the company",
        });
    }
});
