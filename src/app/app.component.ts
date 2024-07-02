import { Component } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { SkillsComponent } from './features/skills/skills.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    SkillsComponent,
    CommonModule,
    BrowserAnimationsModule,
    RouterOutlet
  ]
})
export class AppComponent { }
