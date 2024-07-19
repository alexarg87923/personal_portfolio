import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  skills = [
    { name: 'HTML', level: 100, icon: 'fab fa-html5' },
    { name: 'CSS', level: 100, icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', level: 100, icon: 'fab fa-js' },
    { name: 'Bootstrap', level: 90, icon: 'fab fa-bootstrap' },
    { name: 'React', level: 80, icon: 'fab fa-react' },
    { name: 'Flask', level: 70, icon: 'fab fa-python' },
    { name: 'Python', level: 70, icon: 'fab fa-python' },
    { name: 'MySQL', level: 70, icon: 'fas fa-database' },
    { name: 'C++', level: 60, icon: 'fab fa-cuttlefish' },
    { name: 'C#', level: 60, icon: 'fab fa-microsoft' },
    { name: 'Docker', level: 60, icon: 'fab fa-docker' },
    { name: 'Cloudflare', level: 50, icon: 'fab fa-cloudflare' },
    { name: 'MongoDB', level: 50, icon: 'fab fa-envira' },
    { name: 'Express', level: 50, icon: 'fab fa-node-js' },
    { name: 'TypeScript', level: 40, icon: 'fab fa-js' },
    { name: 'Angular', level: 25, icon: 'fab fa-angular' }
  ];

  generateProgressBar(proficiency: number): string {
    const filledLength = Math.round(proficiency / 100 * 20);
    const emptyLength = 20 - filledLength;
    return '█'.repeat(filledLength) + '⠂'.repeat(emptyLength);
  }
}
