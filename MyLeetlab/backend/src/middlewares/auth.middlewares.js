import jwt from "jsonwebtoken";
import { apiError } from "../utils/api.error.js";
import bcrypt from "bcryptjs"
import { db } from "../libs/db.js";

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

// Goal: check if user exists in db and is verifed
export const isVerified = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const myUser = await db.User.findUnique({ where: { id: userID } })
        if (!myUser) throw new apiError(401, "No such User Exists")
        if (myUser.isEmailVerified) {
            next();
        } else {
            throw new apiError(401, "Email is not verified");
        }
    } catch (error) {
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while user verification",
        });
    }

}

export const checkAdmin = async (req,res,next) => {
    try {
        const userID = req.user._id;
        const myUser = await db.User.findUnique({ where: { id: userID } })
        if (!myUser) throw new apiError(401, "No such User Exists")
        if(!myUser.isEmailVerified) throw new apiError(401, "Email is not verified")
            
        if (myUser.role === "ADMIN") {
            next();
        } else {
            throw new apiError(401, "Access Denied: User is not Admin");
        }
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            });
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while user verification",
        });
    }
}