import { Router } from "express";
import { body, param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongToProject, validateTaskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate)
router.post(
  "/", 
  body("projectName").notEmpty().withMessage("The name is madatory"),
  body("clientName").notEmpty().withMessage("The client is madatory"),
  body("description").notEmpty().withMessage("The description is madatory"),
  handleInputErrors,
  ProjectController.createProject,
);

router.get("/", ProjectController.getAllProjects);

router.get(
  "/:id",
  param("id").isMongoId().withMessage("Id no valid"),
  handleInputErrors,
  ProjectController.getProjectById,
);

router.put(
  "/:id",
  param("id").isMongoId().withMessage("Id no valid"),
  body("projectName").notEmpty().withMessage("The name is madatory"),
  body("clientName").notEmpty().withMessage("The client is madatory"),
  body("description").notEmpty().withMessage("The description is madatory"),
  handleInputErrors,
  ProjectController.updateProjectById,
);

/* Routes for projects */
router.delete(
  "/:id",
  param("id").isMongoId().withMessage("Id no valid"),
  handleInputErrors,
  ProjectController.deleteProjectById,
);

/* Routes for tasks */
router.param("projectId", validateProjectExists);

router.post(
  "/:projectId/tasks",
  body("name").notEmpty().withMessage("The name is madatory"),
  body("description").notEmpty().withMessage("The description is madatory"),
  handleInputErrors,
  TaskController.createTask,
);

router.get("/:projectId/tasks", TaskController.getProjectTasks);

router.param("taskId", validateTaskExists);
router.param("taskId", taskBelongToProject);
router.get(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no valid"),
  TaskController.getTaskById,
);

router.put(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no valid"),
  body("name").notEmpty().withMessage("The name is madatory"),
  body("description").notEmpty().withMessage("The description is madatory"),
  handleInputErrors,
  TaskController.updateTaskById,
);

router.delete(
  "/:projectId/tasks/:taskId",
  param("taskId").isMongoId().withMessage("Id no valid"),
  TaskController.deleteTaskById,
);

router.post(
  "/:projectId/tasks/:taskId/status",
  param("taskId").isMongoId().withMessage("Id no valid"),
  body("status").notEmpty().withMessage("Status is required"),
  handleInputErrors,
  TaskController.updateStatusByTaskId,
);

export default router;
