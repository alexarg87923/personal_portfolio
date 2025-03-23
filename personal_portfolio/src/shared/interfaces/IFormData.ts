interface IComponent {
  id?: number;
}

export interface IAbout extends IComponent {
  summary: string
};

export interface IExperience extends IComponent {
  logo_path: string,
  start_date: string,
  end_date: string,
  working_here_right_now: boolean,
  title: string,
  description: string
};

export interface IProject extends IComponent {
  title: string,
  description: string,
  project_img_path: string,
  host_status: string,
  github_url: string,
  web_url: string,
  collaborators: Array<ICollaborator>
  skills: Array<ISkill>,
};

export interface ICollaborator extends IComponent {
  name: string
  portfolio_url: string
};

export interface ISkill extends IComponent {
  skill: string,
  level: number,
  icon: string
};