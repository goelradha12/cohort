import { apiError } from "../utils/api.error.js";

// Global Express error handler. asyncHandler forwards rejected promises here via
// next(err); without this, such errors fall through to Express's default HTML
// handler instead of the app's JSON `apiError` shape (remediation item 7).
// Must be registered LAST, after all routes, and must keep all four arguments
// so Express recognizes it as an error-handling middleware.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    const isApiError = err instanceof apiError;
    const statusCode = isApiError ? err.statusCode : (err.statusCode || 500);

    // Log server-side with context, but never leak stack traces to the client.
    console.error("Unhandled error", {
        method: req.method,
        path: req.originalUrl,
        statusCode,
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
    });

    return res.status(statusCode).json({
        statusCode,
        success: false,
        message: isApiError ? err.message : "Something went wrong",
        errors: isApiError ? err.errors : [],
    });
};
