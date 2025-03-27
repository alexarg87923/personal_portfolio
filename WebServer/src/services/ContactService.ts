
import { IContact } from '../shared/interfaces/IContact';
import { IFormData } from '../shared/interfaces/IFormData';
import { pool } from '../databases/pg';

export class ContactService {
  async addFormInput(formData: IContact): Promise<IFormData<string>> {
    const pgclient = await pool.connect();
    try {
      console.log(formData);
      await pgclient.query('INSERT INTO personal_portfolio_schema.contact (name, email, message) VALUES ($1, $2, $3)', [formData.name, formData.email, formData.message]);
      return { status: 0};
    } catch (error) {
      console.error('Error occurred while inserting data:', error);
      return { status: 1};
    } finally {
      pgclient.release();
    };
  };
};
