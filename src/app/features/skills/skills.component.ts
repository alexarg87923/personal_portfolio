import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  skills = [
    { name: 'HTML', level: 70, icon: 'fab fa-html5' },
    { name: 'CSS', level: 85, icon: 'fab fa-css3-alt' },
    { name: 'JavaScript', level: 60, icon: 'fab fa-js' },
    { name: 'Angular', level: 50, icon: 'fab fa-angular' },
    { name: 'TypeScript', level: 45, icon: 'fab fa-js' }
  ];

  generateProgressBar(proficiency: number): string {
    const filledLength = Math.round(proficiency / 100 * 20);
    const emptyLength = 20 - filledLength;
    return '█'.repeat(filledLength) + '⠂'.repeat(emptyLength);
  }
}
