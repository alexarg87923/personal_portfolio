export const environment = {
  PSQL_DB_HOST: process.env['PSQL_DB_HOST'] || 'psqlcontainer',
  PSQL_DB_USER: process.env['PSQL_DB_USER'] || 'alex_portfolio_db_admin',
  PSQL_DB_NAME: process.env['PSQL_DB_NAME'] || 'portfolio_db',
  PSQL_DB_PASSWORD: process.env['PSQL_DB_PASSWORD'] || 'pass',
  PSQL_DB_PORT: process.env['PSQL_DB_PORT'] || '5432',
  PSQL_SCHEMA: process.env['PSQL_SCHEMA'] || 'personal_portfolio_schema',
  PORT: process.env['PORT'] || '4000',
  MODE: process.env['MODE'] || 'production', // production | development
  SALT: parseInt(process.env['SALT'] || '15'),
  REDIS_DB_HOST: process.env['REDIS_DB_HOST'] || 'rediscontainer',
  REDIS_SECRET: process.env['REDIS_SECRET'] || '2oJ7VPcJl52PNC6156Q6RI81q2k329',
  REDIS_DB_USER: process.env['REDIS_DB_USER'] || 'alexportfolio',
  REDIS_DB_PASSWORD: process.env['REDIS_DB_PASSWORD'] || 'pass',
  REDIS_DB_PREFIX: process.env['REDIS_DB_PREFIX'] || 'portfolio:',
  REDIS_DB_PORT: process.env['REDIS_DB_PORT'] || '6379',
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info' // trace | debug | info | warn | error | fatal
};
