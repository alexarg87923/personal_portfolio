CREATE TABLE personal_portfolio_schema.collaborator (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  portfolio_url VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
