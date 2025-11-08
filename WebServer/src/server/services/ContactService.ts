
import { type IContact } from '../../shared/interfaces/IContact';
import { type IFormData } from '../../shared/interfaces/IFormData';
import pg from 'pg';
import { type Logger } from 'pino';
import { environment } from '../environments/Environment';

export class ContactService {
  constructor(private dbPool: pg.Pool, private logger: Logger) {};

  async addFormInput(formData: IContact): Promise<IFormData<string>> {
    this.logger.trace('[ContactService] Entering addFormInput');
    const pgclient = await this.dbPool.connect();
    
    try {
      this.logger.debug({ formData }, '[ContactService] Received form data');
      this.logger.info('[ContactService] Processing contact form submission');
      
      this.logger.debug('[ContactService] Executing database insert query');
      await pgclient.query(
        `INSERT INTO ${environment.PSQL_SCHEMA}.contact (name, email, message) VALUES ($1, $2, $3)`,
        [formData.name, formData.email, formData.message]
      );
      this.logger.debug('[ContactService] Contact form submission inserted successfully');
      
      this.logger.trace('[ContactService] Exiting addFormInput (success)');
      return {status: 0};
    } catch (error) {
      this.logger.error({ error }, '[ContactService] Error occurred while inserting data');
      this.logger.trace('[ContactService] Exiting addFormInput (error)');
      return {status: 1};
    } finally {
      this.logger.trace('[ContactService] Releasing database client');
      pgclient.release();
    };
  };
};
