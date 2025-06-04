/*
--------Tasks---------
createTask: anyone
updateTask: (title, desc, attachments) only creater can, 
deleteTask: only creater access
updateTaskStatus: jisko assign kiya gya h vhi update kr skta h
getTasks: admin and project admin can see all tasks, 
getAssignedTasks: all can see their assigned tasks
getCreatedTasks: all can see their assignedBy tasks
*/

import { apiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async-handler.js";

/*
--------SubTasks--------
routes: /:taskID
createSubTask: user with the access to task (assignedTo, assignedBy)
getSubTask: user with the access to task (assignedTo, assignedBy)
deleteSubTask: only creater can delete
updateSubTaskTitle: only creater can update
updateSubTaskStatus: only creater can update
*/

export const getAllTasks = asyncHandler(async function (req,res,next) {
    try {
        
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
export const createNewTask = asyncHandler(async function (req,res,next) {
    try {
        
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
export const getTaskByID = asyncHandler(async function (req,res,next) {
    try {
        
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
export const deleteATask = asyncHandler(async function (req,res,next) {
    try {
        
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
export const updateTaskStatus = asyncHandler(async function (req,res,next) {
    try {
        
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
export const getAssignedTask = asyncHandler(async function (req,res,next) {
    try {
        
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
export const getCreatedTask = asyncHandler(async function (req,res,next) {
    try {
        
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