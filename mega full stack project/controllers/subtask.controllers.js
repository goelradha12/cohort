/*
--------SubTasks--------
routes: /:taskID
createSubTask: user with the access to task 
getSubTask: user with the access to task 
getSubTaskByID: user with the access to task 
deleteSubTask: only creater can delete
updateSubTaskTitle: only creater can update
updateSubTaskStatus: only creater can update
*/

import mongoose from "mongoose";
import { SubTask } from "../models/subtask.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Task } from "../models/task.models.js";

export const getAllSubtasks = asyncHandler(async (req, res, next) => {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const myTask = await Task.findById(taskID);

        if (!myTask)
            throw new apiError(401, "Task doesn't exists")
        const mySubtasks = await SubTask.find({
            task: taskID
        })

        if (!mySubtasks)
            throw new apiError(401, "Subtasks doesn't exists")
        return res.status(200).json(
            new apiResponse(200, mySubtasks, "Subtasks shared successfully")
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
});
export const createSubTask = asyncHandler(async (req, res, next) => {
    try {
        const { title, isCompleted } = req.body;

        const existingSubtask = await SubTask.findOne({
            title,
            createdBy: req.user._id,
            task: req.params.taskID
        })
        if(existingSubtask)
            throw new apiError(401,"Subtask already exists")
        const newSubtask = new SubTask({ 
            title,
            createdBy: req.user._id,
            task: req.params.taskID
        });

        if (isCompleted)
            newSubtask.isCompleted = isCompleted

        await newSubtask.save();

        return res.status(200).json(
            new apiResponse(200, newSubtask, "Subtask created successfully")
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
});
export const getSubtaskByID = asyncHandler(async (req, res, next) => {
    try {
        const taskID = new mongoose.Types.ObjectId(`${req.params.taskID}`);
        const subTaskID = new mongoose.Types.ObjectId(`${req.params.subTaskID}`);
        const myTask = await Task.findById(taskID);

        if (!myTask)
            throw new apiError(401, "Task doesn't exists")
        if (!subTaskID)
            throw new apiError(401, "Subtask ID is required")
        const mySubtask = await SubTask.findById(subTaskID)

        if (!mySubtask)
            throw new apiError(401, "Subtasks doesn't exists")
        return res.status(200).json(
            new apiResponse(200, mySubtask, "Subtasks shared successfully")
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
});
export const updateSubTaskTitle = asyncHandler(async (req, res, next) => {
    try {
        const subTaskID = new mongoose.Types.ObjectId(`${req.params.subTaskID}`);
        const mySubtask = await SubTask.findById(subTaskID)
        const {title} = req.body;

        const existingSubtask = await SubTask.findOne({
            title,
            createdBy: req.user._id,
            task: req.params.taskID
        })
        if(existingSubtask)
            throw new apiError(401,"Subtask already exists")
        
        mySubtask.title = title;
        await mySubtask.save();

        return res.status(200).json(
            new apiResponse(200, mySubtask, "Subtasks title updated successfully")
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
});
export const deleteSubTask = asyncHandler(async (req, res, next) => {
    try {
        const subTaskID = new mongoose.Types.ObjectId(`${req.params.subTaskID}`);
        await SubTask.findByIdAndDelete(subTaskID);
        return res.status(200).json(
            new apiResponse(200, {}, "Subtask deleted successfully")
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
});
export const updateTaskStatus = asyncHandler(async (req, res, next) => {
    try {
        const subTaskID = new mongoose.Types.ObjectId(`${req.params.subTaskID}`);
        const mySubtask = await SubTask.findById(subTaskID)
        const {isCompleted} = req.body;

        mySubtask.isCompleted = isCompleted;
        await mySubtask.save();

        return res.status(200).json(
            new apiResponse(200, mySubtask, "Subtasks status updated successfully")
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
});
