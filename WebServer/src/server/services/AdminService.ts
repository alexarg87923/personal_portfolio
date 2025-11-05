

import { type IAbout, type IExperience, type IProject, type ISkill, type IFormData } from '../../shared/interfaces/IFormData';
import { type ILoginCred } from '../../shared/interfaces/ILoginCred';
import * as bcrypt from 'bcryptjs';
import pg from 'pg';
import { type Logger } from 'pino';

function escapeIdentifier(str: string) {
  return '"' + str.replace(/"/g, '""') + '"';
}

export class AdminService {
  constructor(private dbPool: pg.Pool, private logger: Logger) {};

  async verifyUser(userID: string): Promise<Number> {
    this.logger.trace('[AdminService] Entering verifyUser');
    const client = await this.dbPool.connect();
    
    try {
      this.logger.debug({ userID }, '[AdminService] Executing query to verify user');
      var res = await client.query('SELECT user_id FROM personal_portfolio_schema.users WHERE user_id = $1', [userID]);

      if (res.rowCount === 0 || res.rowCount === null) {
        this.logger.warn({ userID }, '[AdminService] User not found');
        this.logger.trace('[AdminService] Exiting verifyUser (user not found)');
        return 1;
      };

      this.logger.debug({ userID }, '[AdminService] User verified successfully');
      this.logger.trace('[AdminService] Exiting verifyUser (success)');
      return 0;
    } catch (error) {
      this.logger.error({ error, userID }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting verifyUser (error)');
      return 1;
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      client.release();
    };
  };

  async login(formData: ILoginCred): Promise<IFormData<string>> {
    this.logger.trace('[AdminService] Entering login');
    const client = await this.dbPool.connect();
    
    try {
      this.logger.debug({ username: formData.username }, '[AdminService] Executing query to fetch user credentials');
      var res = await client.query('SELECT user_id, hashed_password FROM personal_portfolio_schema.users WHERE username = $1', [formData.username]);
      
      if (res.rowCount === 0 || res.rowCount === null) {
        this.logger.warn({ username: formData.username }, '[AdminService] User not found');
        this.logger.trace('[AdminService] Exiting login (user not found)');
        return {status: 1};
      };

      this.logger.debug('[AdminService] Comparing password hash');
      const isMatch = await bcrypt.compare(formData.password, res.rows[0].hashed_password);

      if (isMatch) {
        this.logger.info({ userId: res.rows[0].user_id }, '[AdminService] Password match successful');
        this.logger.trace('[AdminService] Exiting login (success)');
        return {status: 0, body: [res.rows[0].user_id]};
      } else {
        this.logger.warn({ username: formData.username }, '[AdminService] Password mismatch');
        this.logger.trace('[AdminService] Exiting login (invalid password)');
        return {status: 2};
      };
    } catch (error) {
      this.logger.error({ error }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting login (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      client.release();
    };
  };

  async getAboutData(): Promise<IFormData<IAbout>> {
    this.logger.trace('[AdminService] Entering getAboutData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[AdminService] Executing query to fetch about data');
      var res = await pgclient.query('SELECT id, summary FROM personal_portfolio_schema.about WHERE active = true');
      
      if (res.rowCount === 0 || res.rowCount === null) {
        this.logger.warn('[AdminService] No about data found');
        this.logger.trace('[AdminService] Exiting getAboutData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[AdminService] About data retrieved successfully');
      this.logger.trace('[AdminService] Exiting getAboutData (success)');
      return {status: 0, body: res.rows};
    } catch (error) {
      this.logger.error({ error }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting getAboutData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    }
  }

  async saveAboutData(inputData: IAbout): Promise<number> {
    this.logger.trace('[AdminService] Entering saveAboutData');
    const pgclient = await this.dbPool.connect();

    try {
      this.logger.debug({ aboutId: inputData.id }, '[AdminService] Executing update query for about data');
      var res = await pgclient.query('UPDATE personal_portfolio_schema.about SET summary = $1 WHERE id = $2', [inputData.summary, inputData.id]);
      
      if (res.rowCount === 0 || res?.rowCount === null) {
        this.logger.warn({ aboutId: inputData.id }, '[AdminService] No rows updated for about data');
        this.logger.trace('[AdminService] Exiting saveAboutData (no rows updated)');
        return 1;
      };

      this.logger.info({ aboutId: inputData.id }, '[AdminService] About data saved successfully');
      this.logger.trace('[AdminService] Exiting saveAboutData (success)');
      return 0;
    } catch (error) {
      this.logger.error({ error, aboutId: inputData.id }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting saveAboutData (error)');
      return 1;
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    };
  };

  async getExperienceData(): Promise<IFormData<IExperience>> {
    this.logger.trace('[AdminService] Entering getExperienceData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[AdminService] Executing query to fetch experience data');
      var res = await pgclient.query('SELECT id, logo_path, start_date, end_date, working_here_right_now, title, description FROM personal_portfolio_schema.experience WHERE active = true');
      
      if (res.rowCount === 0) {
        this.logger.warn('[AdminService] No experience data found');
        this.logger.trace('[AdminService] Exiting getExperienceData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[AdminService] Experience data retrieved successfully');
      this.logger.trace('[AdminService] Exiting getExperienceData (success)');
      return {status: 0, body: res.rows};
    } catch (error) {
      this.logger.error({ error }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting getExperienceData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    };
  };

  async saveExperienceData(inputData: IExperience): Promise<number> {
    this.logger.trace('[AdminService] Entering saveExperienceData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug({ experienceId: inputData?.id }, '[AdminService] Validating input data');
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
      
      this.logger.debug({ experienceId: id, fieldsToUpdate: colms }, '[AdminService] Building update query');
      const setClauses = colms.map((colName: string, idx: number) => `${colName} = $${idx + 1}`);

      this.logger.debug('[AdminService] Executing update query for experience data');
      var res = await pgclient.query(`UPDATE personal_portfolio_schema.experience SET ${setClauses.join(', ')} WHERE id = $${colms.length + 1}`, [...Object.values(fieldsToUpdate), id ]);
      
      if (res.rowCount === 0) {
        this.logger.warn({ experienceId: id }, '[AdminService] No rows updated for experience data');
        this.logger.trace('[AdminService] Exiting saveExperienceData (no rows updated)');
        return 1;
      };

      this.logger.info({ experienceId: id }, '[AdminService] Experience data saved successfully');
      this.logger.trace('[AdminService] Exiting saveExperienceData (success)');
      return 0;
    } catch (error) {
      this.logger.error({ error, experienceId: inputData?.id }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting saveExperienceData (error)');
      return 1;
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    };
  };

  async getProjectData(): Promise<IFormData<IProject>> {
    this.logger.trace('[AdminService] Entering getProjectData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[AdminService] Executing query to fetch project data with relationships');
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
        this.logger.warn('[AdminService] No project data found');
        this.logger.trace('[AdminService] Exiting getProjectData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: projectRows.rowCount }, '[AdminService] Project data with relationships retrieved successfully');
      this.logger.trace('[AdminService] Exiting getProjectData (success)');
      return {status: 0, body: projectRows.rows};
    } catch (error) {
      this.logger.error({ error }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting getProjectData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    };
  };


  async saveProjectData(inputData: IProject): Promise<number> {
    this.logger.trace('[AdminService] Entering saveProjectData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug({ projectId: inputData?.id }, '[AdminService] Validating input data');
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

      this.logger.debug({ projectId: id, fieldsToUpdate: colms }, '[AdminService] Building update query');
      // Build `SET` with a simple loop (no pg-format)
      let setClause = '';
      for (let i = 0; i < colms.length; i++) {
        if (i > 0) setClause += ', ';
        setClause += `${escapeIdentifier(colms[i])} = $${i + 1}`;
      }

      const values = [...Object.values(fieldsToUpdate), id];
      const whereIndex = colms.length + 1;

      const query =
        `UPDATE ${escapeIdentifier('personal_portfolio_schema')}.` +
        `${escapeIdentifier('projects')} ` +
        `SET ${setClause} WHERE ${escapeIdentifier('id')} = $${whereIndex} RETURNING *`;

      this.logger.debug('[AdminService] Executing update query for project data');
      const queryResponse = await pgclient.query(query, values);

      if (queryResponse.rowCount === 0) {
        this.logger.warn({ projectId: id }, '[AdminService] No rows updated for project data');
        this.logger.trace('[AdminService] Exiting saveProjectData (no rows updated)');
        return 1;
      }

      this.logger.info({ projectId: id }, '[AdminService] Project data saved successfully');
      this.logger.trace('[AdminService] Exiting saveProjectData (success)');
      return 0;
    } catch (error) {
      this.logger.error({ error, projectId: inputData?.id }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting saveProjectData (error)');
      return 1;
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    }
  };

  async getSkillData(): Promise<IFormData<ISkill>> {
    this.logger.trace('[AdminService] Entering getSkillData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug('[AdminService] Executing query to fetch skill data');
      var res = await pgclient.query('SELECT id, skill FROM personal_portfolio_schema.skills');
      
      if (res.rowCount === 0) {
        this.logger.warn('[AdminService] No skill data found');
        this.logger.trace('[AdminService] Exiting getSkillData (no data)');
        return {status: 1};
      };

      this.logger.debug({ rowCount: res.rowCount }, '[AdminService] Skill data retrieved successfully');
      this.logger.trace('[AdminService] Exiting getSkillData (success)');
      return {status: 0, body: res.rows};
    } catch (error) {
      this.logger.error({ error }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting getSkillData (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    };
  };

  async saveSkillData(inputData: ISkill): Promise<number> {
    this.logger.trace('[AdminService] Entering saveSkillData');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug({ skillId: inputData?.id }, '[AdminService] Validating input data');
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

      this.logger.debug({ skillId: id, fieldsToUpdate: colms }, '[AdminService] Building update query');
      // Build `SET` with a simple loop (no pg-format)
      let setClause = '';
      for (let i = 0; i < colms.length; i++) {
        if (i > 0) setClause += ', ';
        setClause += `${escapeIdentifier(colms[i])} = $${i + 1}`;
      }

      const values = [...Object.values(fieldsToUpdate), id];
      const whereIndex = colms.length + 1;

      const query =
        `UPDATE ${escapeIdentifier('personal_portfolio_schema')}.` +
        `${escapeIdentifier('skills')} ` +
        `SET ${setClause} WHERE ${escapeIdentifier('id')} = $${whereIndex} RETURNING *`;

      this.logger.debug('[AdminService] Executing update query for skill data');
      const queryResponse = await pgclient.query(query, values);

      if (queryResponse.rowCount === 0) {
        this.logger.warn({ skillId: id }, '[AdminService] No rows updated for skill data');
        this.logger.trace('[AdminService] Exiting saveSkillData (no rows updated)');
        return 1;
      }

      this.logger.info({ skillId: id }, '[AdminService] Skill data saved successfully');
      this.logger.trace('[AdminService] Exiting saveSkillData (success)');
      return 0;
    } catch (error) {
      this.logger.error({ error, skillId: inputData?.id }, '[AdminService] Error occurred getting data');
      this.logger.trace('[AdminService] Exiting saveSkillData (error)');
      return 1;
    } finally {
      this.logger.trace('[AdminService] Releasing database client');
      pgclient.release();
    }
  };
}