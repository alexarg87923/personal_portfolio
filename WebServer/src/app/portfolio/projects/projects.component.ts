import { Component, type OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { type IProject } from '../../../shared/interfaces/IFormData';

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
  }

  getSrcSet(project: IProject) {
    return `${project.project_img_path.replace('.webp', '-s.webp').replace('original', 'small')} 480w, ${project.project_img_path.replace('.webp', '-m.webp').replace('original', 'medium')} 800w, ${project.project_img_path.replace('.webp', '-l.webp').replace('original', 'large')} 1200w`;
  }

  sortTechStacks(): void {
    this.projectsData.forEach((project: IProject) => {
      project.skills.sort((a, b) => a.skill.localeCompare(b.skill));
    });
  }
}
