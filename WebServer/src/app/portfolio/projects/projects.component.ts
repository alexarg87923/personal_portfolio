import { Component, type OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  type IProject
} from '../../../shared/interfaces/IFormData';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  imports: [CommonModule],
  standalone: true
})
export class ProjectsComponent implements OnInit {
  @Input() projectsData: Array<IProject> = [];

  ngOnInit() {
    this.sortTechStacks();
  };

  getSrcSet(project: IProject) {
    const makeSrc = (size: string, width: number) =>
      `${project.project_img_path
        .replace('.webp', `-${size[0]}.webp`)
        .replace('original', size)} ${width}w`;

    return `
      ${makeSrc('small', 480)},
      ${makeSrc('medium', 800)},
      ${makeSrc('large', 1200)}`;
  };

  sortTechStacks(): void {
    this.projectsData.forEach((project: IProject) => {
      project.skills.sort((a, b) => a.skill.localeCompare(b.skill));
    });
  };
};
