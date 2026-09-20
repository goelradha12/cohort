import { LANGUAGES } from "../libs/judge0lib.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

// Expose the backend's supported languages so the frontend never maintains a
// separate list. judge0lib is the single source of truth.
export const getSupportedLanguages = asyncHandler(async (req, res) => {
    const languages = LANGUAGES.map(({ key, id, label, monaco }) => ({ key, id, label, monaco }));
    return res.status(200).json(
        new apiResponse(200, languages, "Supported languages fetched successfully")
    );
});
