import { type RedisStore } from 'connect-redis';
import { environment } from '../environments/Environment';
import { randomUUID } from 'crypto';
import pino, { Logger, stdTimeFunctions } from 'pino';
import { join } from 'node:path';
import { createWriteStream } from 'node:fs';
import { mkdirSync } from 'node:fs';

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
    // Critical error during config initialization - logger not yet available
    console.error('ERROR: Database name is empty! PSQL_DB_NAME:', environment.PSQL_DB_NAME);
    throw new Error('Database name cannot be empty. Please set PSQL_DB_NAME environment variable.');
  }

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

  const config: any = {
    base: null,
    timestamp: stdTimeFunctions.isoTime,
    level: LOG_LEVEL || 'info'
  };

  if (MODE === 'development') {
    config.transport = { target: 'pino-pretty' };
  }

  return config;
};

export const createPinoLogger = (): Logger => {
  const { MODE, LOG_LEVEL } = environment;
  const config = getPinoConfig();

  if (MODE === 'production') {
    // In production, write to both stdout and file
    const logsDir = '/app/logs';
    try {
      mkdirSync(logsDir, { recursive: true });
      const logFile = join(logsDir, 'app.log');
      const fileStream = createWriteStream(logFile, { flags: 'a' });
      
      // Use pino.multistream to write to both stdout and file
      return pino(config, pino.multistream([
        { stream: process.stdout },
        { stream: fileStream }
      ]));
    } catch (error) {
      // If we can't create the log file, just use stdout
      // Cannot use logger here as we're in the process of creating it
      console.error('Failed to create log file, using stdout only:', error);
      return pino(config);
    }
  }

  return pino(config);
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
    name: 'connect.sid',
    cookie: MODE === 'development' 
      ? { secure: false, maxAge: 60000, httpOnly: false, sameSite: 'lax' as const }
      : { secure: true, maxAge: 60000, httpOnly: true, sameSite: 'lax' as const }
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