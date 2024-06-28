import { Component } from '@angular/core';
import { NavbarComponent } from './common/nav/nav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [NavbarComponent]
})

export class AppComponent {
  title = 'Portfolio';
}
