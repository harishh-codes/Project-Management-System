import { ActivityLog } from "../models/activityLog.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"

/**
 * Get all activity logs with pagination (admin only)
 */
const getActivityLogs = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can view all activity logs")
  }

  const { page = 1, limit = 20, resourceType, userId } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  const query = {}

  if (resourceType) {
    query.resourceType = resourceType
  }

  if (userId && mongoose.Types.ObjectId.isValid(userId)) {
    query.userId = userId
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    ActivityLog.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          logs,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Activity logs fetched successfully"
      )
    )
})

/**
 * Get activity logs for a specific resource
 */
const getActivityByResource = asyncHandler(async (req, res) => {
  const { resourceType, resourceId } = req.params
  const { page = 1, limit = 20 } = req.query

  if (!resourceType || !resourceId) {
    throw new ApiError(400, "Resource type and ID are required")
  }

  if (!mongoose.Types.ObjectId.isValid(resourceId)) {
    throw new ApiError(400, "Invalid resource ID")
  }

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  const query = {
    resourceType,
    resourceId,
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(query)
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    ActivityLog.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          logs,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Resource activity logs fetched successfully"
      )
    )
})

/**
 * Get user's own activity
 */
const getUserActivity = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 20))
  const skip = (pageNum - 1) * limitNum

  const [logs, total] = await Promise.all([
    ActivityLog.find({ userId: req.user._id })
      .populate("userId", "username email")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    ActivityLog.countDocuments({ userId: req.user._id }),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          logs,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "User activity logs fetched successfully"
      )
    )
})

/**
 * Get activity log by ID (admin only)
 */
const getActivityById = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can view activity log details")
  }

  const { activityId } = req.params

  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    throw new ApiError(400, "Invalid activity ID")
  }

  const activity = await ActivityLog.findById(activityId).populate("userId", "username email fullName")

  if (!activity) {
    throw new ApiError(404, "Activity log not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activity,
        "Activity log fetched successfully"
      )
    )
})

export {
  getActivityLogs,
  getActivityByResource,
  getUserActivity,
  getActivityById,
}
