import { Task } from "../models/task.model.js"
import { Project } from "../models/project.model.js"
import { ActivityLog } from "../models/activityLog.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"

/**
 * Create a new task
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, project, assignee, status = "todo", priority = "medium", dueDate, tags } = req.body

  if (!title?.trim()) {
    throw new ApiError(400, "Task title is required")
  }

  if (!mongoose.Types.ObjectId.isValid(project)) {
    throw new ApiError(400, "Valid project ID is required")
  }

  // Verify project exists and user has access
  const projectDoc = await Project.findById(project)
  if (!projectDoc || projectDoc.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  const hasAccess =
    projectDoc.owner.toString() === req.user._id.toString() ||
    projectDoc.members.some(m => m.userId.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this project")
  }

  const task = await Task.create({
    title: title.trim(),
    description: description?.trim() || "",
    project,
    assignee: assignee || null,
    status,
    priority,
    dueDate: dueDate || null,
    tags: tags || [],
  })

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "create",
    resourceType: "task",
    resourceId: task._id,
    description: `Created task "${task.title}"`,
  })

  const populatedTask = await task.populate("project assignee", "-password -refreshToken")

  return res
    .status(201)
    .json(new ApiResponse(201, populatedTask, "Task created successfully"))
})

/**
 * Get all tasks with pagination and filters
 */
const getAllTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", status = "all", priority = "all" } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  // Get projects user has access to
  const userProjects = await Project.find({
    $or: [
      { owner: req.user._id },
      { "members.userId": req.user._id },
    ],
    isArchived: false,
  }).select("_id")

  const projectIds = userProjects.map(p => p._id)

  const query = {
    isArchived: false,
    project: { $in: projectIds },
    $or: [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ],
  }

  if (status && status !== "all") {
    query.status = status
  }

  if (priority && priority !== "all") {
    query.priority = priority
  }

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("project assignee", "-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    Task.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          tasks,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Tasks fetched successfully"
      )
    )
})

/**
 * Get task by ID
 */
const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)
    .populate("project", "-__v")
    .populate("assignee", "-password -refreshToken")

  if (!task || task.isArchived) {
    throw new ApiError(404, "Task not found")
  }

  // Check project access
  const project = await Project.findById(task.project)
  const hasAccess =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this task")
  }

  return res.status(200).json(new ApiResponse(200, task, "Task fetched successfully"))
})

/**
 * Update task
 */
const updateTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params
  const { title, description, assignee, status, priority, dueDate, tags } = req.body

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)

  if (!task || task.isArchived) {
    throw new ApiError(404, "Task not found")
  }

  // Check project access
  const project = await Project.findById(task.project)
  const hasAccess =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this task")
  }

  const oldData = {
    title: task.title,
    status: task.status,
    priority: task.priority,
    assignee: task.assignee,
  }

  if (title?.trim()) task.title = title.trim()
  if (description !== undefined) task.description = description?.trim() || ""
  if (status) task.status = status
  if (priority) task.priority = priority
  if (dueDate) task.dueDate = dueDate
  if (assignee) task.assignee = assignee
  if (tags) task.tags = tags

  await task.save()

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "update",
    resourceType: "task",
    resourceId: task._id,
    description: `Updated task "${task.title}"`,
    changes: {
      before: oldData,
      after: {
        title: task.title,
        status: task.status,
        priority: task.priority,
        assignee: task.assignee,
      },
    },
  })

  const updatedTask = await task.populate("project assignee", "-password -refreshToken")

  return res.status(200).json(new ApiResponse(200, updatedTask, "Task updated successfully"))
})

/**
 * Delete task (soft delete)
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new ApiError(400, "Invalid task ID")
  }

  const task = await Task.findById(taskId)

  if (!task || task.isArchived) {
    throw new ApiError(404, "Task not found")
  }

  // Check project access
  const project = await Project.findById(task.project)
  const hasAccess =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this task")
  }

  task.isArchived = true
  task.archivedAt = new Date()
  await task.save()

  // Log activity
  await ActivityLog.create({
    userId: req.user._id,
    action: "archive",
    resourceType: "task",
    resourceId: task._id,
    description: `Archived task "${task.title}"`,
  })

  return res.status(200).json(new ApiResponse(200, {}, "Task archived successfully"))
})

/**
 * Get tasks by project
 */
const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params
  const { page = 1, limit = 10, status = "all" } = req.query

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(400, "Invalid project ID")
  }

  // Check project access
  const project = await Project.findById(projectId)
  if (!project || project.isArchived) {
    throw new ApiError(404, "Project not found")
  }

  const hasAccess =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some(m => m.userId.toString() === req.user._id.toString())

  if (!hasAccess) {
    throw new ApiError(403, "You don't have access to this project")
  }

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  const query = {
    project: projectId,
    isArchived: false,
  }

  if (status && status !== "all") {
    query.status = status
  }

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("project", "-__v")
      .populate("assignee", "-password -refreshToken")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    Task.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          tasks,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Project tasks fetched successfully"
      )
    )
})

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
}
