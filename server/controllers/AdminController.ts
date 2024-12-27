import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async getComponentData(req: Request, res: Response): Promise<void> {
    try {
      const [about, experience, project, skill] = await Promise.all([
        this.adminService.getAboutData(),
        this.adminService.getExperienceData(),
        this.adminService.getProjectData(),
        this.adminService.getSkillData(),
      ]);

      const responses = [about, experience, project, skill];

      if (responses.some(response => response.status === 1)) {
        res.status(500).json({ error: 'One or more data retrievals failed' });
        return;
      }

      res.status(200).json({
        about: about.body,
        experience: experience.body,
        project: project.body,
        skill: skill.body,
      });
    } catch (error) {
      console.error("Error fetching component data:", error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      let result = await this.adminService.login(req.body);
      if (result === 0) {
        res.status(201).json({ message: 'success' });
      } else {
        res.status(500).json({ error: 'failed' });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      let result = await this.adminService.logout();
      if (result === 0) {
        res.status(201).json({ message: 'success' });
      } else {
        res.status(500).json({ error: 'failed' });
      }
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
}
