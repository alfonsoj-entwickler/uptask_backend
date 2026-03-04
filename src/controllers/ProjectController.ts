import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    const user = req.user;
    project.manager = user.id;
    
    try {
      await project.save();
      res.send("Created a new project!");
    } catch (error) {
      console.error(`Error createProject: ${error}`);
    }
  };
  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [
          {
            manager: {$in: req.user.id}
          }
        ]
      });
      res.json(projects);
    } catch (error) {
      console.error(`Error getAllProjects: ${error}`);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id).populate("tasks");
      if (!project) {
        const error = new Error(`Project not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(`Project not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }
      res.json(project);
    } catch (error) {
      console.error(`Error getAllProjects: ${error}`);
    }
  };
  static updateProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error(`Project not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }

      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(`Action not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }

      project.clientName = req.body.clientName;
      project.projectName = req.body.projectName;
      project.description = req.body.description;

      await project.save();
      res.send("Project updated");
    } catch (error) {
      console.error(`Error getAllProjects: ${error}`);
    }
  };

  static deleteProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);

      if (!project) {
        const error = new Error(`Project not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }
      if (project.manager.toString() !== req.user.id.toString()) {
        const error = new Error(`Action not found: ${id}`);
        return res.status(404).json({ error: error.message });
      }

      await project.deleteOne();
      res.send("Project deleted");
    } catch (error) {
      console.error(`Error getAllProjects: ${error}`);
    }
  };
}
