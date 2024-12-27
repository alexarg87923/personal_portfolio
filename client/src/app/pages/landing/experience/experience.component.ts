import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NExperience } from '../../../../../../shared/interfaces/IFormData';
import { MonthYearFormatPipe } from './month-year-format.pipe';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  standalone: true,
  imports: [CommonModule, MonthYearFormatPipe]
})

export class ExperienceComponent implements OnInit {
  @Input() experienceData: Array<NExperience> = [];

  sortExperience(): void {
    this.experienceData.sort((a: NExperience, b: NExperience) => {
      return Date.parse(b.start_date) - Date.parse(a.start_date);
    });
    console.log(this.experienceData);
  }

  ngOnInit() {
    this.sortExperience();
  }
}
