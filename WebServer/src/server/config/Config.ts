import { environment } from '../environments/Environment';

export const getRedisConfig = () => {
  const host = environment.MODE === 'development' 
    ? 'localhost'
    : environment.REDIS_DB_HOST;

  return {
    username: environment.REDIS_DB_USER,
    password: environment.REDIS_DB_PASSWORD,
    socket: {
      host: host,
      port: parseInt(environment.REDIS_DB_PORT)
    }
  };
};

export const getPostgresConfig = () => {
  const host = environment.MODE === 'development'
    ? 'localhost'
    : environment.PSQL_DB_HOST;

  return {
    user: environment.PSQL_DB_USER,
    host: host,
    database: environment.PSQL_DB_NAME,
    password: environment.PSQL_DB_PASSWORD,
    port: parseInt(environment.PSQL_DB_PORT || '5432'),
  };
};