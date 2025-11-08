CREATE TABLE {{SCHEMA}}.project_collaborators (
  project_id INT,
  collaborator_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES {{SCHEMA}}.projects(id),
  CONSTRAINT fk_collaborator FOREIGN KEY (collaborator_id) REFERENCES {{SCHEMA}}.collaborator(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
