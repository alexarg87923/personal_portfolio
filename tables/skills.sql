CREATE TABLE personal_portfolio_schema.skills (
  id SERIAL PRIMARY KEY,
  skill VARCHAR(100),
  level INT,
  icon VARCHAR(100),
  active BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
