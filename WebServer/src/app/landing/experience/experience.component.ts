import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IExperience } from '../../../shared/interfaces/IFormData';
import { MonthYearFormatPipe } from './month-year-format.pipe';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  standalone: true,
  imports: [CommonModule, MonthYearFormatPipe]
})

export class ExperienceComponent implements OnInit {
  @Input() experienceData: Array<IExperience> = [];

  sortExperience(): void {
    this.experienceData.sort((a: IExperience, b: IExperience) => {
      return Date.parse(b.start_date) - Date.parse(a.start_date);
    });
    console.log(this.experienceData);
  }

  ngOnInit() {
    this.sortExperience();
  }
}
