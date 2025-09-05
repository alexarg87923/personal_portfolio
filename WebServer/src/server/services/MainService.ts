
import { type IFormData, type IAbout, type IExperience, type IProject, type ISkill } from '../../shared/interfaces/IFormData';
import pg from 'pg';

export class MainService {
  constructor(private dbPool: pg.Pool) {};

  async getAboutData(): Promise<IFormData<IAbout>> {
    const pgclient = await this.dbPool.connect();
    try {
      var res = await pgclient.query('SELECT id, summary FROM personal_portfolio_schema.about WHERE active = true');
      if (res.rowCount === 0 || res.rowCount === null) {
        return {status: 1};
      };

      return {status: 0, body: res.rows[0]};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    };
  };

  async getExperienceData(): Promise<IFormData<Array<IExperience>>> {
    const pgclient = await this.dbPool.connect();
    try {
      var res = await pgclient.query(`SELECT id, logo_path, to_char(start_date, 'YYYY-MM') AS start_date, to_char(end_date, 'YYYY-MM') AS end_date, working_here_right_now, title, description FROM personal_portfolio_schema.experience WHERE active = true`);
      if (res.rowCount === 0) {
        return {status: 1};
      };

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    };
  };


  async getProjectData(): Promise<IFormData<Array<IProject>>> {
    const pgclient = await this.dbPool.connect();
    try {
      var projectsRows = await pgclient.query('SELECT id, title, description, project_img_path, host_status, github_url, web_url FROM personal_portfolio_schema.projects WHERE active = true');

      for (const each of projectsRows.rows) {
        const collaboratorsRes = await pgclient.query(`
          SELECT c.id, c.name, c.portfolio_url 
          FROM personal_portfolio_schema.project_collaborators pc 
          JOIN personal_portfolio_schema.collaborator AS c 
          ON c.id = pc.collaborator_id 
          WHERE pc.project_id = $1
        `, [each.id]);
        each['collaborators'] = collaboratorsRes.rows;
      
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
        return {status: 1};
      };

      return {status: 0, body: projectsRows.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    };
  };

  async getSkillData(): Promise<IFormData<Array<ISkill>>> {
    const pgclient = await this.dbPool.connect();
    try {
      var res = await pgclient.query('SELECT id, skill FROM personal_portfolio_schema.skills');
      if (res.rowCount === 0) {
        return {status: 1};
      };

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    };
  };
};
