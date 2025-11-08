CREATE TABLE {{SCHEMA}}.projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100),
  description TEXT,
  project_img_path VARCHAR(100),
  host_status VARCHAR(100),
  github_url VARCHAR(100),
  web_url VARCHAR(100),
  active BOOLEAN,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
