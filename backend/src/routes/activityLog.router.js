import { Router } from "express"
import {
  getActivityLogs,
  getActivityByResource,
  getUserActivity,
  getActivityById,
} from "../controllers/activityLog.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// All activity routes require authentication
router.use(verifyJWT)

// Get all activities (admin only)
router.route("/").get(getActivityLogs)

// Get user's own activities
router.route("/user/my-activities").get(getUserActivity)

// Get single activity by ID (admin only)
router.route("/details/:activityId").get(getActivityById)

// Get activities for a specific resource
router.route("/:resourceType/:resourceId").get(getActivityByResource)

export default router
