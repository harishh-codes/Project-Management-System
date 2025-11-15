import { Project } from "../models/project.model.js"
import { ActivityLog } from "../models/activityLog.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"

/**
 * Create a new project
 */
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  if (!name?.trim()) {
    throw new ApiError(400, "Project name is required")
  }

  const project = await Project.create({
    name: name.trim(),
    description: description?.trim() || "",
    owner: req.user._id,
    members: [
      {
        userId: req.user._id,
        role: "admin",
      },
    ],
  })

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "create",
    resourceType: "project",
    resourceId: project._id,
    description: `Created project "${project.name}"`,
  })

  const populatedProject = await project.populate("owner members.userId", "-password -refreshToken")

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        populatedProject,
        "Project created successfully"
      )
    )
})

/**
 * Get all projects with pagination and search
 */
const getAllProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", status = "active" } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  const query = {
    isArchived: false,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  }

  if (status && status !== "all") {
    query.status = status
  }

  // Add permission check - user can only see projects they're part of
  const userProjectIds = await Project.find({
    $and: [
      { isArchived: false },
      {
        $or: [
          { owner: req.user._id },
          { "members.userId": req.user._id },
        ],
      },
    ],
  }).select("_id")

  query._id = { $in: userProjectIds.map(p => p._id) }

  const [projects, total] = await Promise.all([
    Project.find(query)
      .populate("owner members.userId", "-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    Project.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          projects,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Projects fetched successfully"
      )
    )
})

/**
 * Get project by ID
 */
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  const project = await Project.findById(projectId).populate(
    "owner members.userId",
    "-password -refreshToken"
  )

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  // Check if user has access
  const hasAccess =
    project.owner._id.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId._id.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this project")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project fetched successfully"))
})

/**
 * Update project
 */
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { name, description, status } = req.body

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  const project = await Project.findById(projectId)

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  // Check if user is project owner or admin
  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can update the project")
  }

  const oldData = {
    name: project.name,
    description: project.description,
    status: project.status,
  }

  if (name?.trim()) project.name = name.trim()
  if (description !== undefined) project.description = description?.trim() || ""
  if (status) project.status = status

  await project.save()

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "update",
    resourceType: "project",
    resourceId: project._id,
    description: `Updated project "${project.name}"`,
    changes: {
      before: oldData,
      after: {
        name: project.name,
        description: project.description,
        status: project.status,
      },
    },
  })

  const updatedProject = await project.populate(
    "owner members.userId",
    "-password -refreshToken"
  )

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Project updated successfully"))
})

/**
 * Delete project (soft delete - archive)
 */
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  const project = await Project.findById(projectId)

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can delete the project")
  }

  project.isArchived = true
  project.archivedAt = new Date()
  await project.save()

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "archive",
    resourceType: "project",
    resourceId: project._id,
    description: `Archived project "${project.name}"`,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project archived successfully"))
})

/**
 * Get project members
 */
const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { page = 1, limit = 10 } = req.query

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  const project = await Project.findById(projectId).populate("owner members.userId", "-password -refreshToken")

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  // Check if user has access
  const hasAccess =
    project.owner._id.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId._id.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this project")
  }

  // Extract member details with pagination
  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  const members = project.members.map(m => m.userId).slice(skip, skip + limitNum)
  const totalMembers = project.members.length

  return res
    .status(200)
    .json(new ApiResponse(200, {
      members: members,
      pagination: {
        totalMembers,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalMembers / limitNum)
      }
    }, "Members fetched successfully"))
})

/**
 * Add member to project
 */
const addProjectMember = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { userId, role = "viewer" } = req.body

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID")
  }

  const project = await Project.findById(projectId)

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can add members")
  }

  const memberExists = project.members.some(m => m.userId.toString() === userId)
  if (memberExists) {
    throw new ApiError(409, "User is already a member of this project")
  }

  project.members.push({
    userId,
    role,
  })

  await project.save()

  const updatedProject = await project.populate(
    "owner members.userId",
    "-password -refreshToken"
  )

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Member added successfully"))
})

/**
 * Remove member from project
 */
const removeProjectMember = asyncHandler(async (req, res) => {
  const { projectId, userId } = req.params

  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid project or user ID")
  }

  const project = await Project.findById(projectId)

  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only project owner can remove members")
  }

  project.members = project.members.filter(m => m.userId.toString() !== userId)
  await project.save()

  const updatedProject = await project.populate(
    "owner members.userId",
    "-password -refreshToken"
  )

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProject, "Member removed successfully"))
})

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
}
