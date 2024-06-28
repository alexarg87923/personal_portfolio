import { Component } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';
import { HeroComponent } from './features/hero/hero.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    ContactComponent
  ]
})

export class AppComponent {
  title = 'Portfolio';
}
