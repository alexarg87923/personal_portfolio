import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../nav/nav.component';
import { FooterComponent } from '../footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { 
  ExperienceComponent
} from './experience/experience.component';
import { 
  type IAbout,
  type IExperience,
  type IProject,
  type ISkill
} from '../../shared/interfaces/IFormData';
import { environment } from '../environment';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  imports: [NavbarComponent, FooterComponent, HeroComponent, 
    ExperienceComponent, AboutComponent, ContactComponent, 
    ProjectsComponent],
  standalone: true
})
export class PortfolioDashboardComponent {
  public fetchedData: IFormData;
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  constructor(private http: HttpClient) {
    this.fetchedData = {
      about: { summary: '' },
      experience: [],
      project: [],
      skill: []
    };
    this.title.setTitle("Alex Arguelles |"
      + " Software Engineer Portfolio - Projects & Experience");
    this.meta.addTag({
      name: "description",
      content: "Explore Alex Arguelles' portfolio showcasing"
       + " software engineering projects, technical skills, "
       + "and career experience in development."
    });
  };

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
  };
};

interface IFormData {
  about: IAbout,
  experience: Array<IExperience>,
  project: Array<IProject>,
  skill: Array<ISkill>
};
