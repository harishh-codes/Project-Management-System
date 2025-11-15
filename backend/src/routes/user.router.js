import { Router } from "express"
import {
  getAllUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// All user routes require authentication
router.use(verifyJWT)

// Admin routes
router.route("/").get(getAllUsers)

// User routes
router.route("/profile").put(updateProfile)

router.route("/avatar").post(updateAvatar)

router.route("/:userId").get(getUserById)

export default router
