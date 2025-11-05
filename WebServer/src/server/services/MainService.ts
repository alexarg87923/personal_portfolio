
import { type IFormData, type IAbout, type IExperience, type IProject, type ISkill } from '../../shared/interfaces/IFormData';
import pg from 'pg';
import { type Logger } from 'pino';

export class MainService {
  constructor(private dbPool: pg.Pool, private logger: Logger) {};

  async getAboutData(): Promise<IFormData<IAbout>> {
    this.logger.trace('[MainService] Entering getAboutData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[MainService] Executing query to fetch about data');
      var res = await pgclient.query('SELECT id, summary FROM personal_portfolio_schema.about WHERE active = true');
      
      if (res.rowCount === 0 || res.rowCount === null) {
        this.logger.warn('[MainService] No about data found');
        this.logger.trace('[MainService] Exiting getAboutData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[MainService] About data retrieved successfully');
      this.logger.trace('[MainService] Exiting getAboutData (success)');
      return {status: 0, body: res.rows[0]};
    } catch (error) {
      this.logger.error({ error }, '[MainService] Error occurred getting data');
      this.logger.trace('[MainService] Exiting getAboutData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[MainService] Releasing database client');
      pgclient.release();
    };
  };

  async getExperienceData(): Promise<IFormData<Array<IExperience>>> {
    this.logger.trace('[MainService] Entering getExperienceData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[MainService] Executing query to fetch experience data');
      var res = await pgclient.query(`SELECT id, logo_path, to_char(start_date, 'YYYY-MM') AS start_date, to_char(end_date, 'YYYY-MM') AS end_date, working_here_right_now, title, description FROM personal_portfolio_schema.experience WHERE active = true`);
      
      if (res.rowCount === 0) {
        this.logger.warn('[MainService] No experience data found');
        this.logger.trace('[MainService] Exiting getExperienceData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[MainService] Experience data retrieved successfully');
      this.logger.trace('[MainService] Exiting getExperienceData (success)');
      return {status: 0, body: res.rows};
    } catch (error) {
      this.logger.error({ error }, '[MainService] Error occurred getting data');
      this.logger.trace('[MainService] Exiting getExperienceData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[MainService] Releasing database client');
      pgclient.release();
    };
  };


  async getProjectData(): Promise<IFormData<Array<IProject>>> {
    this.logger.trace('[MainService] Entering getProjectData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[MainService] Executing query to fetch project data');
      var projectsRows = await pgclient.query('SELECT id, title, description, project_img_path, host_status, github_url, web_url FROM personal_portfolio_schema.projects WHERE active = true');

      this.logger.debug({ projectCount: projectsRows.rows.length }, '[MainService] Fetching collaborators and skills for projects');
      for (const each of projectsRows.rows) {
        this.logger.trace({ projectId: each.id }, '[MainService] Fetching collaborators for project');
        const collaboratorsRes = await pgclient.query(`
          SELECT c.id, c.name, c.portfolio_url 
          FROM personal_portfolio_schema.project_collaborators pc 
          JOIN personal_portfolio_schema.collaborator AS c 
          ON c.id = pc.collaborator_id 
          WHERE pc.project_id = $1
        `, [each.id]);
        each['collaborators'] = collaboratorsRes.rows;
      
        this.logger.trace({ projectId: each.id }, '[MainService] Fetching skills for project');
        const skillsRes = await pgclient.query(`
          SELECT s.id, s.skill 
          FROM personal_portfolio_schema.project_skills ps 
          JOIN personal_portfolio_schema.skills AS s 
          ON s.id = ps.skill_id 
          WHERE ps.project_id = $1
        `, [each.id]);
        each['skills'] = skillsRes.rows;
      }

      if (projectsRows.rowCount === 0) {
        this.logger.warn('[MainService] No project data found');
        this.logger.trace('[MainService] Exiting getProjectData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: projectsRows.rowCount }, '[MainService] Project data with relationships retrieved successfully');
      this.logger.trace('[MainService] Exiting getProjectData (success)');
      return {status: 0, body: projectsRows.rows};
    } catch (error) {
      this.logger.error({ error }, '[MainService] Error occurred getting data');
      this.logger.trace('[MainService] Exiting getProjectData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[MainService] Releasing database client');
      pgclient.release();
    };
  };

  async getSkillData(): Promise<IFormData<Array<ISkill>>> {
    this.logger.trace('[MainService] Entering getSkillData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[MainService] Executing query to fetch skill data');
      var res = await pgclient.query('SELECT id, skill FROM personal_portfolio_schema.skills');
      
      if (res.rowCount === 0) {
        this.logger.warn('[MainService] No skill data found');
        this.logger.trace('[MainService] Exiting getSkillData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[MainService] Skill data retrieved successfully');
      this.logger.trace('[MainService] Exiting getSkillData (success)');
      return {status: 0, body: res.rows};
    } catch (error) {
      this.logger.error({ error }, '[MainService] Error occurred getting data');
      this.logger.trace('[MainService] Exiting getSkillData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[MainService] Releasing database client');
      pgclient.release();
    };
  };
};
