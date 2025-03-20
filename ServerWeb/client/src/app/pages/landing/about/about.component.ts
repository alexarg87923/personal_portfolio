import { Component, Input } from '@angular/core';
import { NAbout } from '../../../../../../shared/interfaces/IFormData';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true
})

export class AboutComponent {
  @Input() aboutData: NAbout = { summary: ''};
}
