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

  return {
    user: environment.PSQL_DB_USER,
    host: host,
    database: environment.PSQL_DB_NAME,
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