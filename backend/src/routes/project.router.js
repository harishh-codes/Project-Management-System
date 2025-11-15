import { Router } from "express"
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
} from "../controllers/project.controller.js"
import { getTasksByProject } from "../controllers/task.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

// All project routes require authentication
router.use(verifyJWT)

// CRUD operations
router.route("/").post(createProject).get(getAllProjects)

router
  .route("/:projectId")
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject)

// Member management
router.route("/:projectId/members").get(getProjectMembers).post(addProjectMember)

router.route("/:projectId/members/:userId").delete(removeProjectMember)

// Project tasks
router.route("/:projectId/tasks").get(getTasksByProject)

export default router
