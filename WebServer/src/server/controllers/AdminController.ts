import { type Request, type Response } from 'express';
import { AdminService } from '../services/AdminService';
import { type Logger } from 'pino';

export class AdminController {
  constructor(private adminService: AdminService, private logger: Logger) {};

  async sessionHandler(req: Request, res: Response, next: Function): Promise<void> {
    this.logger.trace('[AdminController] Entering sessionHandler');
    
    if (!(req.session?.user?.user_id)) {
      this.logger.debug('[AdminController] No user session found, returning unauthorized');
      res.status(401).json({ error: 'Unauthorized' });
      this.logger.trace('[AdminController] Exiting sessionHandler (unauthorized)');
      return;
    } else {
      try {
        this.logger.debug({ userId: req.session?.user?.user_id }, '[AdminController] -> [AdminService] Calling verifyUser');
        // redundant check against DB for security reasons
        var result = await this.adminService.verifyUser(req.session?.user?.user_id);
        this.logger.debug({ result }, '[AdminController] <- [AdminService] verifyUser returned');

        if (result == 0) {
          this.logger.info('[AdminController] User verified, proceeding to next middleware');
          next();
          this.logger.trace('[AdminController] Exiting sessionHandler (success)');
          return;
        } else {
          this.logger.warn('[AdminController] Invalid response from database verification');
          res.status(500).send('Invalid response from the database.');
          this.logger.trace('[AdminController] Exiting sessionHandler (database error)');
          return;
        }
      } catch (error) {
        this.logger.error({ error }, '[AdminController] An unexpected error occurred when verifying the session');
        res.status(500).json({ error: 'An unexpected error occurred when verifying the session' });
        this.logger.trace('[AdminController] Exiting sessionHandler (error)');
      };
    };
    this.logger.warn('[AdminController] Unexpected error path reached');
    res.status(500).send('Unexpected error.');
    this.logger.trace('[AdminController] Exiting sessionHandler (unexpected)');
    return;
  };

  async saveComponentData(req: Request, res: Response): Promise<void> {
    this.logger.trace('[AdminController] Entering saveComponentData');
    
    try {
      const components = [
        { key: 'about', saveMethod: this.adminService.saveAboutData.bind(this.adminService) },
        { key: 'experience', saveMethod: this.adminService.saveExperienceData.bind(this.adminService) },
        { key: 'project', saveMethod: this.adminService.saveProjectData.bind(this.adminService) },
        { key: 'skill', saveMethod: this.adminService.saveSkillData.bind(this.adminService) },
      ];

      this.logger.debug({ componentKeys: components.map(c => c.key) }, '[AdminController] Processing component data save operations');

      for (const component of components) {
        if (req.body[component.key]?.length > 0) {
          this.logger.info({ component: component.key, itemCount: req.body[component.key].length }, '[AdminController] Processing component items');
          
          for (const item of req.body[component.key])
          {
            this.logger.debug({ component: component.key, itemId: item.id }, '[AdminController] -> [AdminService] Calling save method for component item');
            const result = await component.saveMethod(item);
            this.logger.debug({ component: component.key, itemId: item.id, result }, '[AdminController] <- [AdminService] Save method returned');

            if (result === 1) {
              this.logger.error({ component: component.key, itemId: item.id }, '[AdminController] Saving component data failed');
              res.status(500).json({ error: `Saving ${component.key} data failed` });
              this.logger.trace('[AdminController] Exiting saveComponentData (save failed)');
              return;
            };
          };
        };
      };

      this.logger.info('[AdminController] All component data saved successfully');
      res.status(200).json({ message: 'Data saved successfully' });
      this.logger.trace('[AdminController] Exiting saveComponentData (success)');
    } catch (error) {
      this.logger.error({ error }, '[AdminController] Error saving data');
      res.status(500).json({ error: 'An unexpected error occurred' });
      this.logger.trace('[AdminController] Exiting saveComponentData (error)');
    };
  };


  async getComponentData(req: Request, res: Response): Promise<void> {
    this.logger.trace('[AdminController] Entering getComponentData');
    
    try {
      this.logger.debug('[AdminController] -> [AdminService] Calling parallel data retrieval methods');
      const [about, experience, project, skill] = await Promise.all([
        this.adminService.getAboutData(),
        this.adminService.getExperienceData(),
        this.adminService.getProjectData(),
        this.adminService.getSkillData(),
      ]);
      this.logger.debug('[AdminController] <- [AdminService] All data retrieval methods completed');

      const responses = [about, experience, project, skill];

      if (responses.some(response => response.status === 1)) {
        this.logger.error({ responses }, '[AdminController] One or more data retrievals failed');
        res.status(500).json({ error: 'One or more data retrievals failed' });
        this.logger.trace('[AdminController] Exiting getComponentData (retrieval failed)');
        return;
      };

      this.logger.info('[AdminController] All component data retrieved successfully');
      res.status(200).json({
        about: about.body,
        experience: experience.body,
        project: project.body,
        skill: skill.body,
      });
      this.logger.trace('[AdminController] Exiting getComponentData (success)');
    } catch (error) {
      this.logger.error({ error }, '[AdminController] Error fetching component data');
      res.status(500).json({ error: 'An unexpected error occurred' });
      this.logger.trace('[AdminController] Exiting getComponentData (error)');
    };
  };

  async login(req: Request, res: Response): Promise<void> {
    this.logger.trace('[AdminController] Entering login');
    
    try {
      this.logger.debug({ username: req.body?.username }, '[AdminController] -> [AdminService] Calling login method');
      let result = await this.adminService.login(req.body);
      this.logger.debug({ status: result.status }, '[AdminController] <- [AdminService] login returned');
      
      if (result.status === 0) {
        if (result.body) {
          this.logger.info({ userId: result.body[0] }, '[AdminController] Login successful, setting user session');
          req.session.user = { user_id: result.body[0] };
          this.logger.debug('[AdminController] Session saved successfully');
          res.status(200).json({ message: 'Success!' });
          this.logger.trace('[AdminController] Exiting login (success)');
        };
      } else if (result.status === 1) {
        this.logger.warn('[AdminController] Error checking credentials during login');
        res.status(500).json({ error: 'Error checking credentials.' });
        this.logger.trace('[AdminController] Exiting login (credential check error)');
      } else if (result.status === 2) {
        this.logger.warn('[AdminController] Invalid credentials provided');
        res.status(401).json({ error: 'Invalid Credentials.' });
        this.logger.trace('[AdminController] Exiting login (invalid credentials)');
      } else {
        this.logger.error('[AdminController] Catastrophic error during login');
        res.status(500).json({ error: 'Catastrophic error.' });
        this.logger.trace('[AdminController] Exiting login (catastrophic error)');
      };
    } catch (error: any) {
      this.logger.error({ error }, '[AdminController] Internal server error during login');
      res.status(500).json({ error: 'Internal server error', message: error.message });
      this.logger.trace('[AdminController] Exiting login (exception)');
      return;
    };
  };

  async logout(req: Request, res: Response): Promise<void> {
    this.logger.trace('[AdminController] Entering logout');
    
    try {
      this.logger.debug('[AdminController] Clearing session cookie');
      res.clearCookie('connect.sid');
      
      this.logger.debug('[AdminController] Destroying user session');
      req.session.destroy((err) => {
        if (err) {
          this.logger.error({ error: err }, '[AdminController] Error destroying session during logout');
          res.status(500).send('Logout failed');
          this.logger.trace('[AdminController] Exiting logout (session destroy error)');
          return;
        }
        this.logger.info('[AdminController] Session destroyed successfully');
        res.status(201).json({ message: 'success' });
        this.logger.trace('[AdminController] Exiting logout (success)');
        return;
      });
    } catch (error: any) {
      this.logger.error({ error }, '[AdminController] Internal server error logging out');
      res.status(500).json({ error: 'Internal server error logging out', message: error.message });
      this.logger.trace('[AdminController] Exiting logout (exception)');
      return;
    };
  };
};

declare module "express-session" {
  interface SessionData {
    user: { user_id: string };
  }
};
