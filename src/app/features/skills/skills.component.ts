import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  standalone: true,
  imports: [CommonModule, BrowserAnimationsModule],
  animations: [
    trigger('changeText', [
      state('ellipsisOne', style({ opacity: 1 })),
      state('ellipsisTwo', style({ opacity: 1 })),
      state('ellipsisThree', style({ opacity: 1 })),
      transition('* => *', [
        animate('1s')
      ]),
    ])
  ]
})

export class SkillsComponent {
  currentText = 'Loading';
  ellipsisCount = 0;

  constructor() {
    this.animateText();
  }

  animateText() {
    setInterval(() => {
      this.ellipsisCount = (this.ellipsisCount + 1) % 4;
      this.currentText = 'Loading' + '.'.repeat(this.ellipsisCount);
    }, 1000);
  }
 }
