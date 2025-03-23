CREATE TABLE personal_portfolio_schema.project_skills (
  project_id INT,
  skill_id INT,
  CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES personal_portfolio_schema.projects(id),
  CONSTRAINT fk_skills FOREIGN KEY (skill_id) REFERENCES personal_portfolio_schema.skills(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
