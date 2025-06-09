import jwt from 'jsonwebtoken'
import crypto from 'crypto'


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