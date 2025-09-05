import { environment } from '../environments/Environment';
import pg from 'pg';

let pool: pg.Pool | null = null;

export function getPgPool(): pg.Pool {
  if (!pool) {
    pool = new pg.Pool({
      user: environment.PSQL_DB_USER,
      host: environment.MODE === 'development' ? 'localhost' : environment.PSQL_DB_HOST,
      database: environment.PSQL_DB_NAME,
      password: environment.PSQL_DB_PASSWORD,
      port: parseInt(environment.PSQL_DB_PORT || '5432'),
    });
  }
  return pool;
};