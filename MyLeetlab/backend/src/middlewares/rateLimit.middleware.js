import { rateLimit, ipKeyGenerator } from "express-rate-limit";

// Lightweight, in-memory rate limiters (remediation item 10). No external store,
// so overhead is negligible on a single dev/prod node. Applied only to sensitive
// routes, not globally. Exceeding a limit returns HTTP 429 in the app's JSON
// error shape.

const rateLimitResponse = (req, res) => {
    return res.status(429).json({
        statusCode: 429,
        success: false,
        message: "Too many requests. Please slow down and try again shortly.",
        errors: [],
    });
};

// Auth-sensitive endpoints: 10 requests per 15 minutes per IP.
// These run before authentication, so IP is the only available key.
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: rateLimitResponse,
});

// Code execution endpoints: 3 requests per minute per user.
// These run after isLoggedIn, so key on the authenticated user id (fairer than
// IP — several users behind one NAT/office IP are limited independently).
// Falls back to IP if the user id is somehow absent.
export const executionRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 3,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator: (req) => req.user?._id ?? ipKeyGenerator(req.ip),
    handler: rateLimitResponse,
});
