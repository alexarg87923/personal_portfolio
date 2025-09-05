import { type Request, type Response } from 'express';
import { MainService } from '../services/MainService';

export class MainController {
  constructor(private mainService: MainService) {};

  async getPortfolioData(req: Request, res: Response): Promise<void> {
    try {
      const [about, experience, project, skill] = await Promise.all([
        this.mainService.getAboutData(),
        this.mainService.getExperienceData(),
        this.mainService.getProjectData(),
        this.mainService.getSkillData(),
      ]);

      const responses = [about, experience, project, skill];

      if (responses.some(response => response.status === 1)) {
        res.status(500).json({ error: 'One or more data retrievals failed' });
        return;
      };

      res.status(200).json({
        about: about.body,
        experience: experience.body,
        project: project.body,
        skill: skill.body,
      });
    } catch (error) {
      console.error("Error fetching component data: ", error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    };
  };
}
