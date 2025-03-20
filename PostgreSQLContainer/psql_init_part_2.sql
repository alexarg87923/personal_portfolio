CREATE SCHEMA personal_portfolio_schema;
GRANT USAGE, CREATE ON SCHEMA personal_portfolio_schema TO alex_portfolio_db_admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA personal_portfolio_schema TO alex_portfolio_db_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA personal_portfolio_schema GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO alex_portfolio_db_admin;
REVOKE ALL ON DATABASE portfolio_db FROM alex_portfolio_db_admin;
