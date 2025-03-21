CREATE TABLE personal_portfolio_schema.project_collaborators (
  project_id INT,
  collaborator_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES personal_portfolio_schema.projects(id),
  CONSTRAINT fk_collaborator FOREIGN KEY (collaborator_id) REFERENCES personal_portfolio_schema.collaborator(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
