import jwt from "jsonwebtoken";
import { apiError } from "../utils/api.error.js";


export const isLoggedIn = (req,res,next) => {
    // send next() only if valid access token

    const token = req.cookies.accessToken;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: "Invalid Token",
                    error: err,
                    success: false
                });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({
            status: 401,
            message: "User not logged in",
            success: false
        });
    }
}