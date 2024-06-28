import { Component } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent
  ]
})

export class AppComponent {
  title = 'Portfolio';
}
