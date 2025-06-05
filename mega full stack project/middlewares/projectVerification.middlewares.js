import { apiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { Task } from "../models/task.models.js";
import { SubTask } from "../models/subtask.models.js";


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
        const project = req.params.projectID;
        if (!project)
            throw new apiError(401, "ProjectID is required")
        const projectID = new mongoose.Types.ObjectId(`${project}`);
        // get role from userID and projectID
        const UserRole = await ProjectMember.findOne({
            user:  req.user._id,
            project: projectID
        })

        if(!UserRole)
            throw new apiError(401,"Access Denied")
        // check if that role is there in 
        const isVerfied = roles.includes(UserRole.role)
        // console.log(UserRole.role,roles);
        console.log(isVerfied)
        if (isVerfied)
        {
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
    const memberID = new mongoose.Types.ObjectId(`${req.params.memberID}`);
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

export const verifyTaskSpecialAccess = (roles = []) => asyncHandler(async (req,res,next) => {
    try {
        const project = req.params.projectID;
        if (!project)
            throw new apiError(401, "ProjectID is required")
        const projectID = new mongoose.Types.ObjectId(`${project}`);
        
        // get role of user
        const UserRole = await ProjectMember.findOne({
            user:  req.user._id,
            project: projectID
        })
        if(!UserRole)
            throw new apiError(401,"Access Denied")

        // check if that role is there in 
        let isVerfied = roles.includes(UserRole.role)

        if(isVerfied)
            return next();

        // if not in the list, check for task's related users
        const {taskID} = req.params;
        const userID = new mongoose.Types.ObjectId(`${req.user._id}`) 
        if(!taskID)
            throw new apiError(401, "TaskID is required");

        const myTask = await Task.findById(new mongoose.Types.ObjectId(`${taskID}`));
        if(!myTask) throw new apiError(401, "Task doesn't exists")
        
        if(roles.includes("assignedBy"))
            if(myTask.assignedBy.equals(userID)) isVerfied = true;

        if(roles.includes("assignedTo"))
            if(myTask.assignedTo.equals(userID)) isVerfied = true;

        if(isVerfied)
            return next();
        else
        throw new apiError(401, "Access Denied to the Note")
        // if verified say yes!
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

export const verifySubtaskCreater = asyncHandler(async (req, res, next) => {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const subTaskID = new mongoose.Types.ObjectId(`${req.params.subTaskID}`);
        const userID = new mongoose.Types.ObjectId(`${req.user._id}`);

        const myTask = await Task.findById(taskID);

        if (!myTask)
            throw new apiError(401, "Task doesn't exists")
        if (!subTaskID)
            throw new apiError(401, "Subtask ID is required")
        const mySubtask = await SubTask.findById(subTaskID)

        if(userID.equals(mySubtask.createdBy))
            return next();
        
        else
            throw new apiError(401,"Only creater can access the requested action")
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
            message: "Something went wrong while retrieving tasks",
            success: false,
        });
    }
})