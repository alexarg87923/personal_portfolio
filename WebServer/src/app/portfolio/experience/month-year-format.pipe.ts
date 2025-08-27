import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYearFormat',
  standalone: true
})

export class MonthYearFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    const [year, monthStr] = value.split('-');

    if (!monthStr || !year) {
      console.warn(`Invalid date format: ${value}. Expected 'MM-YYYY'.`);
      return value;
    }

    const monthIndex = parseInt(monthStr, 10) - 1;

    const monthNames = [
      "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
      "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
    ];

    if (monthIndex < 0 || monthIndex > 11) {
      console.warn(`Invalid month value: ${monthStr} in date: ${value}.`);
      return value;
    }

    const abbreviatedMonth = monthNames[monthIndex];

    return `${abbreviatedMonth} ${year}`;
  }

}
