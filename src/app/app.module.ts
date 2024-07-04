// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { ProjectsComponent } from './features/projects/projects.component';
import { SkillsComponent } from './features/skills/skills.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    SkillsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent,
    ProjectsComponent,
    SkillsComponent
  ]
})
export class AppModule { }
