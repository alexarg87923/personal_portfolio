interface requestStatus {
  status: number
}

export interface IAbout {
  id: number,
  summary: string
}

export interface IExperience {
  id: number,
  logo_path: string,
  start_date: string,
  end_date: string,
  working_here_right_now: boolean,
  title: string,
  description: string
}

export interface IProject {
  id: number,
  title: string,
  description: string,
  project_img_path: string,
  host_status: string,
  github_url: string,
  web_url: string,
  collaborators: Array<ICollaborator>
  skills: Array<ISkill>,
}

export interface ICollaborator {
  id: number
  name: string
  portfolio_url: string
}

export interface ISkill {
  id: number,
  skill: string,
  level: number,
  icon: string
}
