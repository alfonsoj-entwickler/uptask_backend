import type { Request, Response, NextFunction } from "express";
import Task, { InterfaceTask } from "../models/Task";

declare global {
  namespace Express {
    interface Request {
      task: InterfaceTask;
    }
  }
}

export async function validateTaskExists(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      return res.status(404).json({ error: error.message });
    }
    req.task = task;
    next();
  } catch (error) {
    return res.status(404).json({
      error: "There is a error in middleware - validate task Exists",
    });
  }
}

export function taskBelongToProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.task.project.toString() !== req.project.id.toString()) {
      const error = new Error("Task not valid");
      return res.status(404).json({ error: error.message });
    }
    next();
  } catch (error) {
    return res.status(404).json({
      error: "There is a error in middleware - validate task Exists",
    });
  }
}
