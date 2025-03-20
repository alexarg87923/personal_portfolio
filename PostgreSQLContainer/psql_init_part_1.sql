CREATE DATABASE portfolio_db;
CREATE USER alex_portfolio_db_admin WITH PASSWORD 'pass';
GRANT CONNECT ON DATABASE portfolio_db TO alex_portfolio_db_admin;
