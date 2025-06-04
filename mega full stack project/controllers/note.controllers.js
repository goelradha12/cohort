// create note: a member can create note 
// update note: creater can update the note  
// delete note: creater, admin can delete the note 
// getNotes: any member can get the list of notes

import mongoose from "mongoose";
import { ProjectNote } from "../models/note.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

// need to check if the user has access to the project or not.
// create... anyne can do
// update... check if he is creater then he can update
// check if user is admin or creater for delete note access

export const getNote = asyncHandler(async function (req, res) {
    try {

        const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);
        const notesList = await ProjectNote.find({ project: projectID })
            .populate("createdBy", "name avatar username");

        const data = notesList.map((notes, i) => {
            return {
                key: i,
                id: notes._id,
                createdBy: notes.createdBy,
                content: notes.content
            }
        })
        return res.status(200).json(
            new apiResponse(200, data, "Notes shared successfully")
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
export const getNoteByID = asyncHandler(async function (req, res) {
    console.log(req.params)
    try {
        const noteID = req.params.noteID;
        if (!noteID)
            throw new apiError(401, "Note ID is required.")
        const myNote = await ProjectNote.findById(new mongoose.Types.ObjectId(`${noteID}`))
            .populate("createdBy", "name avatar username");

        if (!myNote)
            throw new apiError(401, "No such note exists.")
        const data = {
            id: myNote._id,
            createdBy: myNote.createdBy,
            content: myNote.content
        }
        return res.status(200).json(
            new apiResponse(200, data, "Note shared successfully")
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
            message: "Something went wrong while getting a Note",
            success: false,
        });
    }
})
export const createNote = asyncHandler(async function (req, res) {
    try {
        const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);
        const userID = req.user._id;
        const { content } = req.body;

        if (!content)
            throw new apiError(401, "content is required");

        const newNote = await ProjectNote.create({
            project: projectID,
            createdBy: userID,
            content
        })

        const data = await ProjectNote.findById(newNote._id).populate("createdBy", "name avatar username")
        return res.status(200).json(
            new apiResponse(200, data, "Notes created successfully")
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
export const updateNote = asyncHandler(async function (req, res) {
    try {
        // update only if user is the creater
        const noteID = new mongoose.Types.ObjectId(`${req.params.noteID}`);
        const { newContent } = req.body;
        const userID = req.user._id;
        if (!(noteID && newContent))
            throw new apiError(401, "Required noteID and updatedContent");

        // get the note
        const myNote = await ProjectNote.findById(noteID);

        // validate noteID
        if (!myNote)
            throw new apiError(401, "Note doesn't exists");
        
        // if note is not created by the user
        // console.log(myNote.createdBy, userID, userID ===myNote.createdBy)
        if (!myNote.createdBy.equals(userID))
            throw new apiError(401, "Invalid Access");

        myNote.content = newContent;
        await myNote.save();
        return res.status(200).json(
            new apiResponse(200, myNote, "Notes updated successfully")
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
export const deleteNote = asyncHandler(async function (req, res) {
    try {
        // delete if user is creater
        const noteID = new mongoose.Types.ObjectId(`${req.params.noteID}`);
        const userID = req.user._id;
        if (!noteID)
            throw new apiError(401, "noteID is Required");

        // get the note
        const myNote = await ProjectNote.findById(noteID);

        // validate noteID
        if (!myNote)
            throw new apiError(401, "Note doesn't exists");

        // if note is not created by the user
        if (!myNote.createdBy.equals(userID))
            throw new apiError(401, "Invalid Access");

        await ProjectNote.findByIdAndDelete(noteID);

        return res.status(200).json(
            new apiResponse(200, {}, "Note deleted successfully")
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