CREATE TABLE project_collaborators (
  project_id INT,
  collaborator_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_collaborator FOREIGN KEY (collaborator_id) REFERENCES collaborator(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
