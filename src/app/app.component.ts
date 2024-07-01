import { Component } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { CertificationsComponent } from './features/certifications/certifications.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    CertificationsComponent,
    FooterComponent
  ]
})

export class AppComponent { }
