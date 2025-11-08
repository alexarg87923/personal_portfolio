import { type RedisStore } from 'connect-redis';
import { environment } from '../environments/Environment';
import { randomUUID } from 'crypto';
import { Logger, stdTimeFunctions } from 'pino';

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

  // Ensure database name is never empty (PostgreSQL defaults to username if empty)
  const database = environment.PSQL_DB_NAME && environment.PSQL_DB_NAME.trim() !== '' 
    ? environment.PSQL_DB_NAME.trim() 
    : 'portfolio_db';

  if (!database || database.trim() === '') {
    console.error('ERROR: Database name is empty! PSQL_DB_NAME:', environment.PSQL_DB_NAME);
    throw new Error('Database name cannot be empty. Please set PSQL_DB_NAME environment variable.');
  }

  console.log('PostgreSQL Config:', { user: environment.PSQL_DB_USER, database, host });

  return {
    user: environment.PSQL_DB_USER,
    host: host,
    database: database,
    password: environment.PSQL_DB_PASSWORD,
    port: parseInt(environment.PSQL_DB_PORT || '5432'),
  };
};

export const getPinoConfig = () => {
  const { MODE, LOG_LEVEL } = environment;

  return {
    transport: MODE === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
    base: null,
    timestamp: stdTimeFunctions.isoTime,
    level: LOG_LEVEL || 'info'
  };
};

export const getPinoHttpConfig = (logger: Logger) => {
  return {
    logger,
    genReqId: () => randomUUID(),
  };
};

export const getSessionConfig = (redisStore: RedisStore) => {
  const { MODE } = environment;

  return {
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: environment.REDIS_SECRET,
    cookie: MODE === 'development' 
      ? { secure: false, maxAge: 60000, httpOnly: false }
      : { secure: true, maxAge: 60000, httpOnly: true }
  };
};

export const getCorsConfig = () => {
  return {
    origin: 'http://localhost:4000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', '*']
  };
}