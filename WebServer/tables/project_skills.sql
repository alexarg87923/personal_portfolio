CREATE TABLE {{SCHEMA}}.project_skills (
  project_id INT,
  skill_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES {{SCHEMA}}.projects(id),
  CONSTRAINT fk_skills FOREIGN KEY (skill_id) REFERENCES {{SCHEMA}}.skills(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
