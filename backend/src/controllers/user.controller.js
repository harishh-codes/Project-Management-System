import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"

/**
 * Get all users (admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admins can view all users")
  }

  const { page = 1, limit = 10, search = "" } = req.query

  const pageNum = Math.max(1, parseInt(page) || 1)
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10))
  const skip = (pageNum - 1) * limitNum

  const query = {
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { fullName: { $regex: search, $options: "i" } },
    ],
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password -refreshToken -forgotPasswordToken -emailVerificationToken")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip),
    User.countDocuments(query),
  ])

  const totalPages = Math.ceil(total / limitNum)

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          users,
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        },
        "Users fetched successfully"
      )
    )
})

/**
 * Get user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID")
  }

  const user = await User.findById(userId).select(
    "-password -refreshToken -forgotPasswordToken -emailVerificationToken"
  )

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
})

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName } = req.body

  const user = await User.findById(req.user._id)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  if (fullName?.trim()) {
    user.fullName = fullName.trim()
  }

  await user.save()

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -forgotPasswordToken -emailVerificationToken"
  )

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"))
})

/**
 * Update user avatar
 */
const updateAvatar = asyncHandler(async (req, res) => {
  // TODO: Implement file upload logic
  const user = await User.findById(req.user._id)

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  // For now, accepting avatar URL from body
  const { avatarUrl } = req.body

  if (avatarUrl) {
    user.avatar = {
      url: avatarUrl,
      localPath: null,
    }
    await user.save()
  }

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken -forgotPasswordToken -emailVerificationToken"
  )

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"))
})

export {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
}
