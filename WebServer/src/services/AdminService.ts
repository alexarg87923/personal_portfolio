

import { type IAbout, type IExperience, type IProject, type ISkill, type IFormData } from '../shared/interfaces/IFormData';
import { type ILoginCred } from '../shared/interfaces/ILoginCred';
import { pool } from '../databases/pg';
import * as bcrypt from 'bcryptjs';
import format from 'pg-format';

export class AdminService {
  async verifyUser(userID: string): Promise<Number> {
    const client = await pool.connect();
    try {
      var res = await client.query('SELECT user_id FROM personal_portfolio_schema.users WHERE user_id = $1', [userID]);

      if (res.rowCount === 0 || res.rowCount === null) {
        return 1;
      };

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      client.release();
    };
  };

  async login(formData: ILoginCred): Promise<IFormData<string>> {
    const client = await pool.connect();
    try {
      var res = await client.query('SELECT user_id, hashed_password FROM personal_portfolio_schema.users WHERE username = $1', [formData.username]);
      if (res.rowCount === 0 || res.rowCount === null) {
        return {status: 1};
      };

      const isMatch = await bcrypt.compare(formData.password, res.rows[0].hashed_password);

      if (isMatch) {
        return {status: 0, body: [res.rows[0].user_id]};
      } else {
        return {status: 2};
      };
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      client.release();
    };
  };

  async getAboutData(): Promise<IFormData<IAbout>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, summary FROM personal_portfolio_schema.about WHERE active = true');
      if (res.rowCount === 0 || res.rowCount === null) {
        return {status: 1};
      };

      return {status: 0, body: res.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    }
  }

  async saveAboutData(inputData: IAbout): Promise<number> {
    const pgclient = await pool.connect();

    try {
      var res = await pgclient.query('UPDATE personal_portfolio_schema.about SET summary = $1 WHERE id = $2', [inputData.summary, inputData.id]);
      if (res.rowCount === 0 || res?.rowCount === null) {
        return 1;
      };

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      pgclient.release();
    };
  };

  async getExperienceData(): Promise<IFormData<IExperience>> {
    const pgclient = await pool.connect();
    try {
      var res = await pgclient.query('SELECT id, logo_path, start_date, end_date, working_here_right_now, title, description FROM personal_portfolio_schema.experience WHERE active = true');
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

  async saveExperienceData(inputData: IExperience): Promise<number> {
    const pgclient = await pool.connect();
    try {
      if (!inputData || typeof inputData !== 'object') {
        throw new Error('Invalid input data: inputData must be a non-null object.');
      };
      const { id, ...fieldsToUpdate } = inputData;

      if (id === undefined || id === null) {
        throw new Error('Invalid input data: "id" is required for the WHERE clause.');
      };

      const colms = Object.keys(fieldsToUpdate);
      if (colms.length === 0) {
        throw new Error('No fields provided to update.');
      };
      const setClauses = colms.map((colName: string, idx: number) => `${colName} = $${idx + 1}`);

      var res = await pgclient.query(`UPDATE personal_portfolio_schema.experience SET ${setClauses.join(', ')} WHERE id = $${colms.length + 1}`, [...Object.values(fieldsToUpdate), id ]);
      if (res.rowCount === 0) {
        return 1;
      };

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      pgclient.release();
    };
  };

  async getProjectData(): Promise<IFormData<IProject>> {
    const pgclient = await pool.connect();
    try {
      const projectRows = await pgclient.query(`
        SELECT
          p.id,
          p.title,
          p.description,
          p.project_img_path,
          p.host_status,
          p.github_url,
          p.web_url,
          COALESCE(collabs.collaborators, '[]'::json)   AS collaborators,
          COALESCE(skills.skills,        '[]'::json)    AS skills
        FROM personal_portfolio_schema.projects AS p
        LEFT JOIN LATERAL (
          SELECT json_agg(
                  json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'portfolio_url', c.portfolio_url
                  )
                  ORDER BY c.name
                ) AS collaborators
          FROM personal_portfolio_schema.project_collaborators AS pc
          JOIN personal_portfolio_schema.collaborator AS c
            ON c.id = pc.collaborator_id
          WHERE pc.project_id = p.id
        ) AS collabs ON TRUE
        LEFT JOIN LATERAL (
          SELECT json_agg(
                  json_build_object(
                    'id', s.id,
                    'skill', s.skill
                  )
                  ORDER BY s.skill
                ) AS skills
          FROM personal_portfolio_schema.project_skills AS ps
          JOIN personal_portfolio_schema.skills AS s
            ON s.id = ps.skill_id
          WHERE ps.project_id = p.id
        ) AS skills ON TRUE
        WHERE p.active = TRUE
        ORDER BY p.id;
      `);

      if (projectRows.rowCount === 0) {
        return {status: 1};
      };

      return {status: 0, body: projectRows.rows};
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return {status: 1};
    } finally {
      pgclient.release();
    };
  };


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

      const setClause = colms.map((c, idx) => format('%I = $%s', c, idx + 1)).join(', ');

      const values = [...Object.values(fieldsToUpdate), id];

      const query = format(
        'UPDATE personal_portfolio_schema.projects SET %s WHERE id = $%s RETURNING *',
        setClause,
        colms.length + 1
      );

      const queryResponse = await pgclient.query(query, values);

      if (queryResponse.rowCount === 0) {
        return 1;
      };

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      pgclient.release();
    };
  };

  async getSkillData(): Promise<IFormData<ISkill>> {
    const pgclient = await pool.connect();
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

      const setClause = colms
        .map((c, idx) => format('%I = $%s', c, idx + 1))
        .join(', ');

      const values = [...Object.values(fieldsToUpdate), id];

      const query = format(
        'UPDATE %I.%I SET %s WHERE id = $%s RETURNING *',
        'personal_portfolio_schema',
        'skills',
        setClause,
        colms.length + 1
      );

      const queryResponse = await pgclient.query(query, values);

      if (queryResponse.rowCount === 0) {
        return 1;
      };

      return 0;
    } catch (error) {
      console.error('Error occurred getting data: ', error);
      return 1;
    } finally {
      pgclient.release();
    };
  };
};
