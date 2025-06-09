import jwt from "jsonwebtoken";
import { apiError } from "../utils/api.error.js";
import bcrypt from "bcryptjs"

export const isLoggedIn = (req, res, next) => {
    // send next() only if valid access token

    const token = req.cookies.accessToken;
    // console.log(token);
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

export const hashPassword = async (params, next) => {
    if (params.model == 'User' && (params.action == 'create' || params.action == 'update')) {
        const data = params.args.data;

        if (data?.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
        }
    }

    return next(params);
    // Logic only runs for delete action and Post model
}