import { Component } from '@angular/core';
import { NavbarComponent } from '../../common/nav/nav.component';
import { FooterComponent } from '../../common/footer/footer.component';
import { HeroComponent } from './hero/hero.component';
import { ExperienceComponent } from './experience/experience.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProjectsComponent } from './projects/projects.component';
import { SkillsComponent } from './skills/skills.component';

@Component({
  selector: 'app-root',
  templateUrl: './landing.component.html',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, HeroComponent, ExperienceComponent, AboutComponent, ContactComponent, ProjectsComponent, SkillsComponent]
})

export class LandingComponent { }
