// addMemberToProject, updateMember, getProjectMembers,
// updateMemberRole, deleteMember
import { asyncHandler } from "../utils/async-handler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { apiError } from "../utils/api.error.js";
import { apiResponse } from "../utils/api.response.js";
import { AvailableUserRoles } from "../utils/constants.js";
import mongoose from "mongoose";

export const addMemberToProject = asyncHandler(async function (req, res) {
  // Goal: Add a user as member to the project
  try {
    // 1. Get the user ID and project ID
    const { userID, role } = req.body;
    const projectID = new mongoose.Types.ObjectId(`${req.params.projectID}`);

    if(!userID)
      throw new apiError(401,"UserID is required")
    // 2. create a new document to the model
    const myProjectMem = new ProjectMember({ user: userID, project: projectID })
    if (role && AvailableUserRoles.includes(role))
      myProjectMem.role = role;

    await myProjectMem.save();

    res.status(200).json(
      new apiResponse(200, myProjectMem, "Project member added successfully")
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
});

export const getProjectMembers = asyncHandler(async function (req, res) {
  // Goal: Add a user as member to the project
  try {
    // 1. Get the project ID
    const { projectID } = req.params;

    let memberList = await ProjectMember.find({ project: projectID })
                      .populate("user","name avatar username")

    let data = memberList.map((member, i) => {
      return {
        key: i,
        memberId: member._id,
        userId: member.user,
        userName: member.name,
        userAvatar: member.avatar,
        userUsername: member.username,
        projectId: member.project,
        role: member.role
      }
    })
    res.status(200).json(
      new apiResponse(200, data, "Project member shared successfully")
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
});

export const getMemberByID = asyncHandler(async function (req, res) {
  try {
    const memberID = new mongoose.Types.ObjectId(`${req.params.memberID}`);
    const myMember = await ProjectMember.findById(memberID);
    return res.status(200).json(
      new apiResponse(200, myMember, "Member shared successfully")
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

export const updateMember = asyncHandler(async function (req, res) {
  try {
    const memberId = new mongoose.Types.ObjectId(`${req.params.memberID}`);
    const { newUserID } = req.body;

    // check if userID exists
    if(!newUserID)
      throw new apiError(401, "New UserID required")
    const myUser = await User.findById(newUserID);
    if (!myUser)
      throw new apiError(401, "User doesn't exists")

    const myMember = await ProjectMember.findById(memberId);
    myMember.user = newUserID;
    await myMember.save();
    return res.status(200).json(
      new apiResponse(200, myMember, "Member updated successfully")
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

export const updateMemberRole = asyncHandler(async function (req, res) {
  try {
    const memberId = new mongoose.Types.ObjectId(`${req.params.memberID}`);
    const { newRole } = req.body;

    if (!(newRole && AvailableUserRoles.includes(newRole)))
      throw new apiError(401, "Role is Required")

    const myMember = await ProjectMember.findById(memberId)

    myMember.role = newRole;
    await myMember.save();

    return res.status(200).json(
      new apiResponse(200, myMember, "Member updated successfully")
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

export const deleteMember = asyncHandler(async function (req, res) {
  try {
    const memberId = new mongoose.Types.ObjectId(`${req.params.memberID}`);
    const myMember = await ProjectMember.deleteOne({ _id: memberId })

    return res.status(200).json(
      new apiResponse(200, myMember, "Member deleted successfully")
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