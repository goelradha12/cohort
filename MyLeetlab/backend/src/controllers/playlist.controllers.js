import { apiError } from "../utils/api.error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAllListDetails = asyncHandler(async function (req, res) {
    // Goal: send all playlist details created by a user
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while fetching playlist details"
        })
    }
})

export const createPlaylist = asyncHandler(async function (req, res) {
    // Goal: create a new playlist, each playlist has unique name
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while creating playlist"
        })
    }
})

export const deletePlaylist = asyncHandler(async function (req, res) {
    // Goal: delete a playlist
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while deleting playlist"
        })
    }
})

export const getPlaylistDetails = asyncHandler(async function (req, res) {
    // get playlist details with ID
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while fetching playlist details"
        })
    }
})

export const addProblemToPlaylist = asyncHandler(async function (req, res) {
    // Goal: add problem to playlist, if not already in one
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while adding problem to playlist"
        })
    }
})

export const removeProblemFromPlaylist = asyncHandler(async function (req, res) {
    // goal: Remove a problem from playlist
    try {
        
    } catch (error) {
        console.log(error);
        if(error instanceof apiError)
        {
            return res.status(error.statusCode).json({
                statusCode: error.statusCode,
                message: error.message,
                success: false
            })
        }
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Something went wrong while removing problem from playlist"
        })
    }
})