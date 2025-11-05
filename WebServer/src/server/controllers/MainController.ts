import { type Request, type Response } from 'express';
import { MainService } from '../services/MainService';
import { type Logger } from 'pino';

export class MainController {
  constructor(private mainService: MainService, private logger: Logger) {};

  async getPortfolioData(req: Request, res: Response): Promise<void> {
    this.logger.trace('[MainController] Entering getPortfolioData');
    
    try {
      this.logger.debug('[MainController] -> [MainService] Calling parallel data retrieval methods');
      const [about, experience, project, skill] = await Promise.all([
        this.mainService.getAboutData(),
        this.mainService.getExperienceData(),
        this.mainService.getProjectData(),
        this.mainService.getSkillData(),
      ]);
      this.logger.debug('[MainController] <- [MainService] All data retrieval methods completed');

      const responses = [about, experience, project, skill];

      if (responses.some(response => response.status === 1)) {
        this.logger.error({ responses }, '[MainController] One or more data retrievals failed');
        res.status(500).json({ error: 'One or more data retrievals failed' });
        this.logger.trace('[MainController] Exiting getPortfolioData (retrieval failed)');
        return;
      };

      this.logger.info('[MainController] All portfolio data retrieved successfully');
      res.status(200).json({
        about: about.body,
        experience: experience.body,
        project: project.body,
        skill: skill.body,
      });
      this.logger.trace('[MainController] Exiting getPortfolioData (success)');
    } catch (error) {
      this.logger.error({ error }, '[MainController] Error fetching component data');
      res.status(500).json({ error: 'An unexpected error occurred' });
      this.logger.trace('[MainController] Exiting getPortfolioData (error)');
    };
  };
}
