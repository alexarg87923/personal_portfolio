import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from '../../common/nav/nav.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';
import { NAbout, NExperience, NProject, NSkill } from '../../../../../shared/interfaces/IFormData';

@Component({
  selector: 'app-root',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HeroComponent, ExperienceComponent, AboutComponent, ContactComponent, ProjectsComponent, SkillsComponent, HttpClientModule]
})

export class LandingComponent {
  fetchedData: IFormData;

  constructor(private http: HttpClient) {
    this.fetchedData = {
      about: { summary: '' },
      experience: [],
      project: [],
      skill: []
    }
  }

  ngOnInit(): void {
    this.http.get<IFormData>('/api/')
    .subscribe({
      next: response => {
        this.fetchedData = response;
      },
      error: error => {
        console.error('Error doing GET request', error);
        alert('Failed to do GET request');
      }
    })
  }
}

interface IFormData {
  about: NAbout,
  experience: Array<NExperience>,
  project: Array<NProject>,
  skill: Array<NSkill>
}
