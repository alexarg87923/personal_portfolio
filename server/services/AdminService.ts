

import { IAbout, IExperience, IProject, ISkill } from '../../shared/interfaces/IFormData';
import { ILoginCred } from '../../shared/interfaces/ILoginCred';
import { pool } from '../databases/pg';
import redis from '../databases/redis';

export class AdminService {
  async login(formData: ILoginCred): Promise<number> {
    const client = await pool.connect();
    return 0;
  }

  async logout(): Promise<number> {
    return 0;
  }

  async getAboutData(): Promise<IFormData<IAbout>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, summary FROM about WHERE active = true');
      if (res.rowCount === 0) {
        return {status: 1, body: []};
      }

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    }
  }

  async getExperienceData(): Promise<IFormData<IExperience>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, logo_path, start_date, end_date, working_here_right_now, title, description FROM experience WHERE active = true');
      if (res.rowCount === 0) {
        return {status: 1, body: []};
      }

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    }
  }

  async getProjectData(): Promise<IFormData<IProject>> {
    const pgclient = await pool.connect();
    try {
      var projectsRows = await pgclient.query('SELECT id, title, description, project_img_path, host_status, github_url, web_url FROM projects WHERE active = true');

      projectsRows.rows.forEach(async each => {
        var collaboratorsRows = await pgclient.query(`SELECT c.id, c.name, c.portfolio_url FROM project_collaborators pc JOIN collaborator AS c ON c.id = pc.collaborator_id WHERE pc.project_id = ${each.id}`);
        each.collaborators = collaboratorsRows.rows;

        var skillsRows = await pgclient.query(`SELECT s.id, s.skill FROM project_skills ps JOIN skills AS s ON s.id = ps.skill_id WHERE ps.project_id = ${each.id};`);
        each.skills = skillsRows.rows;
      });

      if (projectsRows.rowCount === 0) {
        return {status: 1, body: []};
      }

      return {status: 0, body: projectsRows.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    }
  }

  async getSkillData(): Promise<IFormData<ISkill>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, skill, level, icon FROM skills WHERE active = true');
      if (res.rowCount === 0) {
        return {status: 1, body: []};
      }

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1, body: []};
    } finally {
      pgclient.release();
    }
  }

}

interface IFormData<T> {
  status: number,
  body: Array<T>
}
