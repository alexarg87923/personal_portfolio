import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',                      // Custom HTML tag to represent this component
  templateUrl: './hero.component.html',      // Path to the HTML template for this component
  styleUrls: ['./hero.component.css']        // Path to the stylesheet for this component
})
export class HeroComponent {
  // Properties
  heroName: string = 'Superman';
  heroPower: string = 'Flight';

  // Constructor for initializing services or other necessary setup
  constructor() {
    // Component initialization
  }

  // Methods for the component's functionality
  displayHeroInfo() {
    console.log(`Hero: ${this.heroName} - Power: ${this.heroPower}`);
  }
}
