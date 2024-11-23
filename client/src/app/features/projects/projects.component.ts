import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  projects = [
    {
      name: 'SHPE Website',
      description: 'A website created for the SHPE club at Miami Dade College to welcome new members and maintain a historical record. Collaborated with Kevin Pino and Emilio Laurenti.',
      githubLink: 'Private',
      projectUrl: 'https://www.shpemdc.com',
      hosted: 'Personal Ubuntu Server',
      imageUrl: '/assets/original-sizes/shpemdc.webp',
      imageSmall: '/assets/small-sizes/shpemdc-s.webp',
      imageMedium: '/assets/medium-sizes/shpemdc-m.webp',
      imageLarge: '/assets/large-sizes/shpemdc-l.webp',
      techStack: ['Bootstrap', 'Flask', 'MySQL', 'Cloudflare', 'HTML', 'CSS', 'JavaScript', 'Python'],
      collaborators: [
        { name: 'Kevin Pino', portfolioUrl: 'https://kevinpino.com' },
        { name: 'Emilio Laurenti', portfolioUrl: null }
      ]
    },
    {
      name: 'Women in Tech Website',
      description: 'Developed in collaboration with the Women in Tech club at Miami Dade College and Kevin Pino. The project aims to offer coding practice and web design opportunities.',
      githubLink: 'Private',
      projectUrl: 'https://www.witmdc.com',
      hosted: 'Personal Ubuntu Server',
      imageUrl: '/assets/original-sizes/witmdc.webp',
      imageSmall: '/assets/small-sizes/witmdc-s.webp',
      imageMedium: '/assets/medium-sizes/witmdc-m.webp',
      imageLarge: '/assets/large-sizes/witmdc-l.webp',
      techStack: ['Bootstrap', 'Express', 'JavaScript', 'React', 'Figma', 'Cloudflare', 'CSS', 'HTML', 'SQLite', 'Axios', 'GitHub'],
      collaborators: [
        { name: 'Kevin Pino', portfolioUrl: 'https://kevinpino.com' },
        { name: 'Fer Pacheco', portfolioUrl: null }
      ]
    },
    {
      name: 'Robotics Club Event Page',
      description: 'Created with the Robotics Club at Miami Dade College to serve as an interest form and announcement page for a robot fighting event. Collaborated with Felipe Rodas, Stephanie Abantos, Kevin Pino, and Emilio Laurenti.',
      githubLink: 'https://github.com/alexarg87923/project_robotics',
      projectUrl: 'NoURL',
      hosted: 'Offline',
      imageUrl: '/assets/original-sizes/termitomator.webp',
      imageSmall: '/assets/small-sizes/termitomator-s.webp',
      imageMedium: '/assets/medium-sizes/termitomator-m.webp',
      imageLarge: '/assets/large-sizes/termitomator-l.webp',
      techStack: ['React', 'Google Domains', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Axios', 'GitHub'],
      collaborators: [
        { name: 'Kevin Pino', portfolioUrl: 'https://kevinpino.com' },
        { name: 'Emilio Laurenti', portfolioUrl: null },
        { name: 'Felipe Rodas', portfolioUrl: null },
        { name: 'Stephanie Abantos', portfolioUrl: null }
      ]
    },
    {
      name: 'Chess Engine',
      description: 'A personal project to refine C++ object-oriented programming skills through the development of a chess engine.',
      githubLink: 'Private',
      projectUrl: 'NoURL',
      hosted: 'Offline',
      imageUrl: '/assets/original-sizes/chess.webp',
      imageSmall: '/assets/small-sizes/chess-s.webp',
      imageMedium: '/assets/medium-sizes/chess-m.webp',
      imageLarge: '/assets/large-sizes/chess-l.webp',
      techStack: ['C++', 'GLOG', 'SFML', 'GitHub']
    },
    {
      name: 'XML Validator and Parser',
      description: 'An XML validator and parser developed during an internship at UKG, in collaboration with Adrian Wright, Luis Seoene, and Heidi Heid Villar.',
      githubLink: 'Private',
      projectUrl: 'Private',
      hosted: 'Company Windows Server using IIS',
      imageUrl: '/assets/original-sizes/ukg.webp',
      imageSmall: '/assets/small-sizes/ukg-s.webp',
      imageMedium: '/assets/medium-sizes/ukg-m.webp',
      imageLarge: '/assets/large-sizes/ukg-l.webp',
      techStack: ['C#', '.NET', 'Docker', 'XUnit Test', 'GitHub'],
      collaborators: [
        { name: 'Adrian Wright', portfolioUrl: null },
        { name: 'Luis Seoene', portfolioUrl: null },
        { name: 'Heidi Heid Villar', portfolioUrl: null }
      ]
    }
  ];

  ngOnInit() {
    this.sortTechStacks();
  }

  getSrcSet(project: { imageSmall: any; imageMedium: any; imageLarge: any; }) {
    return `${project.imageSmall} 480w, ${project.imageMedium} 800w, ${project.imageLarge} 1200w`;
  }

  sortTechStacks(): void {
    this.projects.forEach(project => {
      project.techStack.sort((a, b) => a.localeCompare(b));
    });
  }
}
