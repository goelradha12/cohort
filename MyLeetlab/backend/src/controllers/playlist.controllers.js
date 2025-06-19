import { db } from "../libs/db.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAllListDetails = asyncHandler(async function (req, res) {
    // Goal: send all playlist details created by a user
    try {
        const userId = req.user._id;

        // include problem is problemplaylist table, going in problem table
        const myPlaylists = await db.Playlist.findMany({
            where: {
                userId
            },
            include: {
                problem: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        res.status(200).json(
            new apiResponse(200, myPlaylists, "Playlist Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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
        const userId = req.user._id;
        const { name, description } = req.body;

        const doesExist = await db.Playlist.findFirst({
            where: {
                userId,
                name
            }
        })
        if (doesExist)
            throw new apiError(400, "Playlist with same name already exists")
        const myPlaylist = await db.Playlist.create({
            data: {
                userId,
                name,
                description
            }
        })

        res.status(200).json(
            new apiResponse(200, myPlaylist, "Playlist Created Successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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
        const playlistId = req.params.playlistId;

        if (!playlistId)
            throw new apiError(400, "Playlist ID is required")
        const myPlaylist = await db.Playlist.delete({
            where: {
                id: playlistId,
                userId: req.user._id
            }
        })
        if (!myPlaylist)
            throw new apiError(404, "Playlist Not Found")
        res.status(200).json(
            new apiResponse(200, myPlaylist, "Playlist Deleted Successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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
        const playlistId = req.params.playlistId;

        if (!playlistId)
            throw new apiError(400, "Playlist ID is required")
        const myPlaylist = await db.Playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user._id
            },
            include: {
                problem: {
                    include: {
                        problem: true
                    }
                }
            }
        })
        if (!myPlaylist)
            throw new apiError(404, "Playlist Not Found")
        res.status(200).json(
            new apiResponse(200, myPlaylist, "Playlist Fetched Successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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
        const { playlistId } = req.params;
        const { problemIds } = req.body;

        // validating playlistId
        const myPlaylist = await db.Playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user._id
            }
        })
        if (!myPlaylist)
            throw new apiError(404, "Playlist Not Found")


        // validated


        const problemplaylist = await db.ProblemPlaylist.createMany({
            data: problemIds.map(async (problemId) => {
                const problem = await db.Problem.findUnique({
                    where: {
                        id: problemId
                    }
                })
                if (!problem)
                    throw new apiError(404, "Wrong input: Problem Not Found")

                return {
                    playlistId,
                    problemId
                }
            })
        })

        res.status(200).json(
            new apiResponse(200, problemplaylist, "Problem added to playlist successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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
        const { playlistId } = req.params;
        const { problemIds } = req.body;

        // validating playlistId
        const myPlaylist = await db.Playlist.findUnique({
            where: {
                id: playlistId,
                userId: req.user._id
            }
        })
        if (!myPlaylist)
            throw new apiError(404, "Playlist Not Found")

        const problemplaylist = await db.ProblemPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        })
        res.status(200).json(
            new apiResponse(200, problemplaylist, "Problem removed from playlist successfully")
        )
    } catch (error) {
        console.log(error);
        if (error instanceof apiError) {
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