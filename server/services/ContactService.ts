
import { Pool } from 'pg';
import { IContact } from '../interfaces/IContact';

import { environment } from '../environments/environment.prod';

const pool = new Pool({
  user: environment.DB_USER,
  host: environment.DB_HOST,
  database: environment.DB_NAME,
  password: environment.DB_PASSWORD,
  port: parseInt(environment.DB_PORT || '5432'),
});

export class ContactService {
  async addFormInput(formData: IContact): Promise<number> {
    const client = await pool.connect();
    try {
      console.log(formData);
      await client.query('INSERT INTO contact (name, email, message) VALUES ($1, $2, $3)', [formData.name, formData.email, formData.message]);
      return 0;
    } catch (error) {
      console.error('Error occurred while inserting data:', error);
      return 1;
    } finally {
      client.release();
    }
  }
}
