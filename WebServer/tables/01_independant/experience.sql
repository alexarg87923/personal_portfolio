CREATE TABLE {{SCHEMA}}.experience (
  id SERIAL PRIMARY KEY,
  logo_path VARCHAR(100),
  start_date DATE,
  end_date DATE,
  working_here_right_now BOOLEAN,
  title VARCHAR(100),
  description TEXT,
  active BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
