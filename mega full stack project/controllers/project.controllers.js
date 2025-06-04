// getProjects, createProject, deleteProject, 
// getProjectByID, updateProject
import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { UserRolesEnum } from "../utils/constants.js";

export const getProjects = asyncHandler(async function (req,res) {

    // Goal: A user can see all his projects
    try {
        // 1. If user exists, find userID in db
        const myUser = req.user;
        // console.log(myUser)
        // 2. Find all the project from that userID
        let data = await ProjectMember.find({user: myUser._id})
                            .populate("project","_id name description createdAt updatedAt")
        
    
        // 3. Send that json Data
        res.status(200).json(
            new apiResponse(200,data,"Projects sent successfully")
        )

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

export const createProject = asyncHandler(async function (req,res) {
    // goal: create a new project, save user as admin in projectmember schema
    try {
        
        // 1. get the data
        const {name, description} = req.body;
        const userID = req.user._id;
        
        // 2. Check if user has a project with same name
        const existingProject = await Project.findOne({
            createdBy: userID,
            name,
        }) 

        if(existingProject)
            throw new apiError(401, "Project already exists with same name")

        // 3. Create a new project, add description if provided
        const newProject = new Project({name,createdBy: userID})

        if(description)
            newProject.description = description;

        await newProject.save();

        // create a entry in projectmember
        const newProjectMember = new ProjectMember({
            user: userID,
            project: newProject._id,
            role: UserRolesEnum.ADMIN
        })

        await newProjectMember.save();

        // 4. Send response
        res.status(200).json(
            new apiResponse(200,newProject,"Project added successfully")
        )
        
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

export const deleteProject = asyncHandler(async function (req,res) {
    // Goal: delete a project by it's name
    try {
    const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);

    if(!projectID)
        throw new apiError(401,"ProjectID is required")
    const myProject = await Project.findOne({
        _id: projectID
    })

    if(!myProject)
        throw new apiError(401,"No such project exists")
    
    await Project.deleteOne({_id: myProject._id})

    res.status(200).json(
        new apiResponse(200,"Project deleted successfully")
    )
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

export const getProjectByID = asyncHandler(async function (req,res) {
    try {
        const {projectID} = req.params;
        
        if(!projectID)
            throw new apiError(401,"projectID is required")

        const myProject = await Project.findById(new mongoose.Types.ObjectId(`${projectID}`))

        if(!myProject)
            throw new apiError(401, "No such proejct exists")

        res.status(200).json(
            new apiResponse(200,myProject,"Project shared successfully")
        )
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

export const updateProject = asyncHandler(async function (req,res) {
    // goal: update name or description of the project
    try {
        // get data
        const {newName, newDescription} = req.body;
        const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);

        // check if such project exists
        if(!projectID)
            throw new apiError(401,"projectID is required")
        const myProject = await Project.findOne({
            _id: projectID})
        if(!myProject)
            throw new apiError(401,"No such project exists")
        
        // if asked for name, update it
        if(newName)
            myProject.name = newName

        // if asked for desc update it
        if(newDescription)
            myProject.description = newDescription

        // save and send response
        await myProject.save()

        res.status(200).json(
            new apiResponse(
                200,
                {name: myProject.name,
                description: myProject.description,
                createdAt: myProject.createdAt,
                updatedAt: myProject.updatedAt,},
                "Project details updated successfully")
        )
        
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