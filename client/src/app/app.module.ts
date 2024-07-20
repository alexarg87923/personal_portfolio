// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeroComponent } from './features/hero/hero.component';
import { ExperienceComponent } from './features/experience/experience.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { SkillsComponent } from './features/skills/skills.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    SkillsComponent,
    ExperienceComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    SkillsComponent,
    ExperienceComponent
  ]
})
export class AppModule { }
