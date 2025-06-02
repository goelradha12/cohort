import { apiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";


export const verifyUser = asyncHandler(async (req, res, next) => {
    // Goal: after isLoggedIn, check if such user exists in db
    try {
        const userID = new mongoose.Types.ObjectId(`${req.user._id}`);

        const myUser = await User.findById(userID);
        if (!myUser)
            throw new apiError(401, "User doesn't exists");

        if (myUser && myUser.isEmailVerified) {
            req.user = {
                _id: myUser._id,
                name: myUser.name,
                avatar: myUser.avatar,
                username: myUser.username,
                email: myUser.email
            }
            next();
        }
        else {
            throw new apiError(401, "User isn't verified")
        }

    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }

})

export const verifyProjectAccess = (roles = []) => asyncHandler(async (req, res, next) => {
    // Goal: take an array of roles and verify if the user
    // has a role (mentioned in array) for the project
    try {
        const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);
        console.log(projectID)
        if (!projectID)
            throw new apiError(401, "ProjectID is required")
        // get role from userID and projectID
        const UserRole = await ProjectMember.findOne({
            user: req.user._id,
            project: projectID
        }).select(['role'])

        if(!UserRole)
            throw new apiError(401,"Access Denied")
        // check if that role is there in 
        const isVerfied = roles.includes(UserRole.role)
        // console.log(UserRole.role,roles);
        console.log(isVerfied)
        if (isVerfied)
        {
            console.log("verified")
            next();
        }
        else
            throw new apiError(401, "Access Denied")
    } catch (error) {
        console.log(error)
        if (error instanceof apiError) {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false,
            })
        }

        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong",
        })
    }
})

export const verifyMember = asyncHandler(async (req,res,next) => {
    // Goal: take memberID from params and check if it is valid member
    const {memberID,projectID} = req.params;
    try {
        
        const myMember = ProjectMember.findById(memberID);
        if(myMember) next();
        else throw new apiError(401,"Invalid Member")
        
    } catch (error) {
       console.log(error);
        if (error instanceof apiError) {
        return res.status(error.statusCode).json({
            statusCode: error.statusCode,
            message: error.message,
            success: false,
        });
        }

        return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        success: false,
        }); 
    }
})