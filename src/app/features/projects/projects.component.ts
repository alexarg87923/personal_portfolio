import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  standalone: true,
  imports: [
    CommonModule
  ],
})

export class ProjectsComponent {
  projects = [
    {
      name: 'SHPE Website',
      description: 'A website created for the SHPE club at Miami Dade College to welcome new members and maintain a historical record. Collaborated with Kevin Pino and Emilio Laurenti.',
      githubLink: 'Private',
      projectUrl: 'https://www.shpemdc.com',
      techStack: ['Bootstrap', 'Flask', 'MySQL', 'Ubuntu Linux', 'Cloudflare', 'HTML', 'CSS', 'JavaScript', 'Python']
    },
    {
      name: 'Women in Tech Website',
      description: 'Developed in collaboration with the Women in Tech club at Miami Dade College and Kevin Pino. The project aims to offer coding practice and web design opportunities.',
      githubLink: 'Private',
      projectUrl: 'https://www.witmdc.com',
      techStack: ['Bootstrap', 'Express', 'JavaScript', 'React', 'Figma', 'Ubuntu Linux', 'Cloudflare', 'CSS', 'HTML', 'SQLite', 'Axios', 'GitHub']
    },
    {
      name: 'Robotics Club Event Page',
      description: 'Created with the Robotics Club at Miami Dade College to serve as an interest form and announcement page for a robot fighting event. Collaborated with Felipe Rodas, Stephanie Abantos, Kevin Pino, and Emilio Laurenti.',
      githubLink: 'https://github.com/alexarg87923/project_robotics',
      projectUrl: 'https://www.termitomator.com',
      techStack: ['React', 'Ubuntu Linux', 'Google Domains', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'MongoDB Atlas', 'Axios', 'GitHub']
    },
    {
      name: 'Chess Engine',
      description: 'A personal project to refine C++ object-oriented programming skills through the development of a chess engine.',
      githubLink: 'Private',
      projectUrl: 'No URL',
      techStack: ['C++', 'GLOG', 'SFML', 'GitHub']
    },
    {
      name: 'XML Validator and Parser',
      description: 'An XML validator and parser developed during an internship at UKG, in collaboration with Adrian Wright, Luis Seoene, and Heidi Heid Villar.',
      githubLink: 'Private',
      projectUrl: 'Private',
      techStack: ['C#', '.NET', 'Docker', 'Windows Server', 'XUnit Test', 'GitHub']
    }
  ];

  ngOnInit() {
    this.sortTechStacks();
  }

  sortTechStacks(): void {
    this.projects.forEach(project => {
      project.techStack.sort((a, b) => a.localeCompare(b));
    });
  }
}
