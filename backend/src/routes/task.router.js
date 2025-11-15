import { Router } from "express"
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByProject,
} from "../controllers/task.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// All task routes require authentication
router.use(verifyJWT)

// CRUD operations
router.route("/").post(createTask).get(getAllTasks)

router
  .route("/:taskId")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask)

// Project-specific tasks
router.route("/project/:projectId").get(getTasksByProject)

export default router
