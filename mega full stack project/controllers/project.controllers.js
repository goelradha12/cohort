// getProjects, createProject, deleteProject, 
// getProjectByID, updateProject
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getProjects = asyncHandler(async function (req,res) {

    // Goal: A user can see all his projects
    // 1. If user exists, find userID in db
    const userID = req.user._id;
    // console.log(userID)
    try {
        if(!userID)
        {
            throw new apiError(401,"User doesn't Exists");
        }
        const myUser = await User.findOne({_id: userID})
        if(!myUser)
            throw new apiError(401,"User doesn't Exists");
        
        // 2. Find all the project from that userID
        let data = await Project.find({createdBy: myUser._id}).sort({updatedAt:-1});

        data = data.map((project,i)=>{
            return {
                id: i,
                name: project.name,
                description: project.description,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt,
            }
        })
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
    // goal: create a new project
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
    const {name} = req.body;

    if(!name)
        throw new apiError(401,"Name required to delete a Project")
    const myProject = await Project.findOne({
        createdBy: req.user._id,
        name,
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
        const {id} = req.body;
        
        if(!id)
            throw new apiError(401,"ID is required")

        const myProject = await Project.findOne({
            _id: id,
            createdBy: req.user._id
        })

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
        const {name, newName, newDescription} = req.body;

        // check if such project exists
        if(!name)
            throw new apiError(401,"Project name is required")
        const myProject = await Project.findOne({
            createdBy: req.user._id,
            name})
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