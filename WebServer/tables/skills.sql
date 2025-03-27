CREATE TABLE personal_portfolio_schema.skills (
  id SERIAL PRIMARY KEY,
  skill VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
