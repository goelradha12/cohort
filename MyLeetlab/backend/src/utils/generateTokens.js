import jwt from 'jsonwebtoken'
import crypto from 'crypto'

// Cookie options for auth cookies. Environment-aware so the same code works for
// local dev (same-origin http://localhost) and a cross-site production setup
// (frontend and backend on different subdomains over HTTPS).
//
// Cross-site cookies (e.g. leetcode.radhagoyal.in -> api.leetcode.radhagoyal.in)
// MUST be SameSite=None; Secure, or the browser will not send them. In dev we use
// SameSite=Lax without Secure so cookies work over plain http on localhost.
export const getCookieOptions = (maxAge = 24 * 60 * 60 * 1000) => {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge,
    };
};


// generate refresh token
const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(
        { _id: user.id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    )
    return refreshToken
}

// generate access token
const generateAccessToken = (user) => {
    const accessToken = jwt.sign(
        { _id: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    )
    return accessToken
}

// generate hashed and unhashed tokens
const generateTemporaryTokens = () => {
    const hashedToken = crypto.randomBytes(24).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)
    return { hashedToken, tokenExpiry }
}

export {
    generateRefreshToken,
    generateAccessToken,
    generateTemporaryTokens
}