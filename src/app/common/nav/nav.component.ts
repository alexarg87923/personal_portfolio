import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent {
  public isOpen: boolean = false;

  constructor() {}

  toggleNavbar() {
    this.isOpen = !this.isOpen;
  }
}
