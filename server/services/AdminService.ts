

import { IAbout, IExperience, IFormData, IProject, ISkill } from '../../shared/interfaces/IFormData';
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
      if (res.rowCount === 0 || res.rowCount === null) {
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

  async saveAboutData(inputData: IAbout): Promise<number> {
    const pgclient = await pool.connect();

    try {
      var res = await pgclient.query('UPDATE about SET summary = $1 WHERE id = $2', [inputData.summary, inputData.id]);
      if (res.rowCount === 0 || res?.rowCount === null) {
        return 1;
      }

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
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

  async saveExperienceData(inputData: IExperience): Promise<number> {
    const pgclient = await pool.connect();
    try {
      if (!inputData || typeof inputData !== 'object') {
        throw new Error('Invalid input data: inputData must be a non-null object.');
      }
      const { id, ...fieldsToUpdate } = inputData;

      if (id === undefined || id === null) {
        throw new Error('Invalid input data: "id" is required for the WHERE clause.');
      }

      const colms = Object.keys(fieldsToUpdate);
      if (colms.length === 0) {
        throw new Error('No fields provided to update.');
      }
      const setClauses = colms.map((colName: string, idx: number) => `${colName} = $${idx + 1}`);

      var res = await pgclient.query(`UPDATE experience SET ${setClauses.join(', ')} WHERE id = $${colms.length + 1}`, [...Object.values(fieldsToUpdate), id ]);
      if (res.rowCount === 0) {
        return 1;
      }

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
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


  async saveProjectData(inputData: IProject): Promise<number> {
    const pgclient = await pool.connect();
    try {
      if (!inputData || typeof inputData !== 'object') {
        throw new Error('Invalid input data: inputData must be a non-null object.');
      }
      const { id, ...fieldsToUpdate } = inputData;

      if (id === undefined || id === null) {
        throw new Error('Invalid input data: "id" is required for the WHERE clause.');
      }

      const colms = Object.keys(fieldsToUpdate);
      if (colms.length === 0) {
        throw new Error('No fields provided to update.');
      }
      const setClauses = colms.map((colName: string, idx: number) => `${colName} = $${idx + 1}`);

      var res = await pgclient.query(`UPDATE projects SET ${setClauses.join(', ')} WHERE id = $${colms.length + 1}`, [...Object.values(fieldsToUpdate), id ]);
      if (res.rowCount === 0) {
        return 1;
      }

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
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

  async saveSkillData(inputData: ISkill): Promise<number> {
    const pgclient = await pool.connect();
    try {
      if (!inputData || typeof inputData !== 'object') {
        throw new Error('Invalid input data: inputData must be a non-null object.');
      }
      const { id, ...fieldsToUpdate } = inputData;

      if (id === undefined || id === null) {
        throw new Error('Invalid input data: "id" is required for the WHERE clause.');
      }

      const colms = Object.keys(fieldsToUpdate);
      if (colms.length === 0) {
        throw new Error('No fields provided to update.');
      }
      const setClauses = colms.map((colName: string, idx: number) => `${colName} = $${idx + 1}`);

      var res = await pgclient.query(`UPDATE skills SET ${setClauses.join(', ')} WHERE id = $${colms.length + 1}`, [...Object.values(fieldsToUpdate), id ]);
      if (res.rowCount === 0) {
        return 1;
      }

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      pgclient.release();
    }
  }

}