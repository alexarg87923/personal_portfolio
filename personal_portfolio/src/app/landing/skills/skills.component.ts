import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ISkill } from '../../../shared/interfaces/IFormData';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SkillsComponent {
  @Input() webDevelopmentSkills: Array<ISkill> = [];
  @Input() backendDevelopmentSkills: Array<ISkill> = [];
  @Input() otherSkills: Array<ISkill> = [];
  activeTab: string = 'web-development';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
