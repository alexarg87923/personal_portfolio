import { type Request, type Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  };

  async sessionHandler(req: Request, res: Response, next: Function): Promise<void> {
    // console.log("BODY: ", req.body)
    // console.log("HEADER: ", req.headers)
    // console.log("METHOD: ", req.method)
    // console.log("SESSION: ", req.session)
    // console.log("user_id: ", req.session.user?.user_id)
    if (!(req.session?.user?.user_id)) {
      // const ua = req.headers['user-agent'];
      // if (ua && ua.toLowerCase().includes('node')) {
      //   console.log('Ignoring node request');
      //   res.sendStatus(204);
      //   return;
      // }
      res.status(401).json({ error: 'Unauthorized' });
      return;
    } else {
      try {
        // redundant check against DB for security reasons
        var result = await this.adminService.verifyUser(req.session?.user?.user_id);

        if (result == 0) {
          next();
          return;
        } else {
          res.status(500).send('Invalid response from the database.');
          return;
        }
      } catch (error) {
        console.error('An unexpected error occurred when veirfying the session:', error);
        res.status(500).json({ error: 'An unexpected error occurred when veirfying the session' });
      };
    };
    res.status(500).send('Unexpected error.');
    return;
  };

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
            };
          };
        };
      };

      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    };
  };


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

  async login(req: Request, res: Response): Promise<void> {
    try {
      let result = await this.adminService.login(req.body);
      if (result.status === 0) {
        if (result.body) {
          console.log("before")
          req.session.user = { user_id: result.body[0] };
          console.log("after session save")
          // req.session.save((err2) => {
          //   if (err2) {
          //     console.log(err2);
          //   }
          //   console.log('Saved SID:', req.sessionID);
          // });
          res.status(200).json({ message: 'Success!' });
        };
      } else if (result.status === 1) {
        res.status(500).json({ error: 'Error checking credentials.' });
      } else if (result.status === 2) {
        res.status(401).json({ error: 'Invalid Credentials.' });
      } else {
        res.status(500).json({ error: 'Catastrophic error.' });
      };
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
      console.log(error);
      return;
    };
  };

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('connect.sid');
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          return res.status(500).send('Logout failed');
        }
        return res.status(201).json({ message: 'success' });
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error logging out', message: error.message });
      console.log(error);
      return;
    };
  };
};

declare module "express-session" {
  interface SessionData {
    user: { user_id: string };
  }
};
