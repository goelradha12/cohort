/*
--------Tasks---------
createTask: anyone
updateTask: (title, desc, attachments) only creater can + admin + project_admin
deleteTask: only creater access + admin + project_admin
updateTaskStatus: jisko assign kiya gya h vhi update kr skta h + admin + project_admin
getTasks: admin and project admin can see all tasks, 
getAssignedTasks: all can see their assigned tasks
getCreatedTasks: all can see their assignedBy tasks
*/

import mongoose from "mongoose";
import { Task } from "../models/task.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { User } from "../models/user.models.js";
import { ProjectMember } from "../models/projectmember.models.js";



export const getAllTasks = asyncHandler(async function (req, res, next) {
    try {
        const { projectID } = req.params;
        const myTasks = Task.find({ project: projectID })
            .populate("assignedTo", "username email name avatar");

        if (!myTasks)
            throw new apiError(401, "No tasks exists")
        res.status(200).json(
            new apiResponse(200, myTasks, "All tasks Shared")
        )

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
export const createNewTask = asyncHandler(async function (req, res, next) {
    try {
        const { title, description, assignedToUsername, status, attachments } = req.body;
        const { projectID } = req.params;
        const userID = req.user._id;

        // first verify is assignedTo user has access to the project
        const assignedToUser = await User.findOne({ username: assignedToUsername })
        if (!assignedToUser)
            throw new apiError(401, "No such user exists")

        const projectAccess = await ProjectMember.findOne({
            user: assignedToUser._id,
            project: projectID
        })

        if (!projectAccess)
            throw new apiError(401, "Task can't be assigned to this user")
        const myTask = new Task({
            title,
            description,
            project: projectID,
            assignedTo: assignedToUser._id,
            assignedBy: userID,
            status,
            attachments
        })

        await myTask.save();
        res.status(200).json(
            new apiResponse(200, myTask, "Task created Successfully")
        )
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
export const getTaskByID = asyncHandler(async function (req, res, next) {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const myTask = await Task.findById(taskID)
        .populate("assignedTo","name username email avatar")
        .populate("assignedBy","name username email avatar");

        if (!myTask)
            throw new apiError(401, "Task doesn't exists")
        return res.status(200).json(
            new apiResponse(200, myTask, "Task shared")
        )
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
            message: "Something went wrong while getting the task",
            success: false,
        });
    }
})
export const deleteATask = asyncHandler(async function (req, res, next) {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);

        await Task.findOneAndDelete({ _id: taskID })
        return res.status(200).json(
            new apiResponse(200, {}, "Task deleted successfully")
        )
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
            message: "Something went wrong while deleting a task",
            success: false,
        });
    }
})
export const updateTask = asyncHandler(async function (req, res, next) {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const {newTitle, newDescription} = req.body;

        if(!(newTitle || newDescription))
            throw new apiError(401, "No changes to update")
        const myTask = await Task.findById(taskID);
        if (!myTask)
            throw new apiError(401, "Task doesn't exists")

        if(newTitle)
            myTask.title = newTitle;
        if(newDescription)
            myTask.description = newDescription;

        await myTask.save();

        return res.status(200).json(
            new apiResponse(200, myTask, "Task shared")
        )
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
            message: "Something went wrong while updating task",
            success: false,
        });
    }
})
export const updateStatus = asyncHandler(async function (req, res, next) {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const { status } = req.body;
        const myTask = await Task.findById(taskID);

        if (!myTask)
            throw new apiError(401, "Task doesn't exists")

        myTask.status = status;
        await myTask.save();

        return res.status(200).json(
            new apiResponse(200, myTask, "Task Status updated")
        )
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
            message: "Something went wrong while updating the status",
            success: false,
        });
    }
})
export const getAssignedTask = asyncHandler(async function (req, res, next) {
    try {
        const { projectID } = req.params;
        const myTasks = await Task.find({
            project: projectID,
            assignedTo: req.user._id
        })
            .populate("assignedBy", "username email name avatar");

        if (!myTasks)
            throw new apiError(401, "No tasks exists")
        res.status(200).json(
            new apiResponse(200, myTasks, "All Assigned tasks Shared")
        )

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
            message: "Something went wrong while getting task",
            success: false,
        });
    }
})
export const getCreatedTask = asyncHandler(async function (req, res, next) {
    try {
        const { projectID } = req.params;
        const myTasks = await Task.find({
            project: projectID,
            assignedBy: req.user._id
        })
            .populate("assignedTo", "username email name avatar");

        if (!myTasks)
            throw new apiError(401, "No tasks exists")
        console.log("I am here")
        res.status(200).json(
            new apiResponse(200, myTasks, "All created tasks Shared")
        )
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
            message: "Something went wrong while getting created task",
            success: false,
        });
    }
})