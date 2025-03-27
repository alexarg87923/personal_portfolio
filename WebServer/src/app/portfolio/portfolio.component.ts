import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { IAbout, IExperience, IProject, ISkill } from '../../shared/interfaces/IFormData';
import { environment } from '../environment';

@Component({
  selector: 'app-root',
  templateUrl: './portfolio.component.html',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HeroComponent, 
    ExperienceComponent, AboutComponent, ContactComponent, 
    ProjectsComponent]
})

export class PortfolioComponent {
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
    if (environment.MODE === 'development') {
      this.http.get<IFormData>('/data/portfolio.json')
      .subscribe({
        next: response => {
          this.fetchedData = response;
        },
        error: error => {
          console.error('Error doing GET request', error);
        }
      });
    } else {
      this.http.get<IFormData>('/api/')
      .subscribe({
        next: response => {
          this.fetchedData = response;
        },
        error: error => {
          console.error('Error doing GET request', error);
        }
      });
    }
  }
}

interface IFormData {
  about: IAbout,
  experience: Array<IExperience>,
  project: Array<IProject>,
  skill: Array<ISkill>
}
