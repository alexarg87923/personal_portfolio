import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './nav.component.html',
})

export class NavbarComponent {
  public isOpen: boolean = false;

  constructor() {}

  toggleNavbar() {
    this.isOpen = !this.isOpen;
  }
}
