import { Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  async saveComponentData(req: Request, res: Response): Promise<void> {
    try {
      const components = [
        { key: 'about', saveMethod: this.adminService.saveAboutData.bind(this.adminService) },
        { key: 'experience', saveMethod: this.adminService.saveExperienceData.bind(this.adminService) },
        { key: 'project', saveMethod: this.adminService.saveProjectData.bind(this.adminService) },
        { key: 'skill', saveMethod: this.adminService.saveSkillData.bind(this.adminService) },
      ];

      for (const component of components) {
        if (req.body[component.key]?.length > 0) {
          for (const item of req.body[component.key])
          {
            const result = await component.saveMethod(item);

            if (result === 1) {
              res.status(500).json({ error: `Saving ${component.key} data failed` });
              return;
            }
          }
        }
      }

      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
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
      console.error("Error fetching component data: ", error);
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
