import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html'
})
export class SkillsComponent {
  skills = [
    {
      skill: 'HTML',
      proficiency: 90,
      projects: ['shpemdc', 'witmdc']
    },
    {
      skill: 'CSS',
      proficiency: 85,
      projects: ['shpemdc', 'witmdc']
    },
    {
      skill: 'JavaScript',
      proficiency: 75,
      projects: ['shpemdc']
    },
    {
      skill: 'React',
      proficiency: 65,
      projects: ['witmdc']
    }
  ];

  generateProgressBar(proficiency: number): string {
    const filledLength = Math.round(proficiency / 100 * 20); // Calculate filled length based on total length (20 characters)
    const emptyLength = 20 - filledLength; // Remaining length to be filled with empty characters
    return '█'.repeat(filledLength) + '⠂'.repeat(emptyLength);
  }
}
