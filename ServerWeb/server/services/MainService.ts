
import { IFormData, NAbout, NExperience, NProject, NSkill } from '../../shared/interfaces/IFormData';
import { pool } from '../databases/pg';

export class MainService {

  async getAboutData(): Promise<IFormData<NAbout>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, summary FROM personal_portfolio_schema.about WHERE active = true');
      if (res.rowCount === 0 || res.rowCount === null) {
        return {status: 1, body: []};
      };

      return {status: 0, body: res.rows[0]};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    };
  };

  async getExperienceData(): Promise<IFormData<Array<NExperience>>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query(`SELECT id, logo_path, to_char(start_date, 'YYYY-MM') AS start_date, to_char(end_date, 'YYYY-MM') AS end_date, working_here_right_now, title, description FROM personal_portfolio_schema.experience WHERE active = true`);
      if (res.rowCount === 0) {
        return {status: 1, body: []};
      };

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    };
  };


  async getProjectData(): Promise<IFormData<Array<NProject>>> {
    const pgclient = await pool.connect();
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
        return {status: 1, body: []};
      };

      return {status: 0, body: projectsRows.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    };
  };

  async getSkillData(): Promise<IFormData<Array<NSkill>>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, skill, level, icon FROM personal_portfolio_schema.skills WHERE active = true');
      if (res.rowCount === 0) {
        return {status: 1, body: []};
      };

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    };
  };
};
