import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WorkExperience {
  date: string;
  title: string;
  description: string;
  logoUrl: string;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  standalone: true,
  imports: [CommonModule]
})

export class ExperienceComponent {
  workExperiences: WorkExperience[] = [
    {
      date: 'Jan. 2024 - Present',
      title: 'Software Engineer Intern at Ultimate Kronos Group',
      description: 'Collaborated closely with a team of engineers and business analysts to debug SQL and C# enterprise level software, ensuring minimal downtime and prompt resolution of problems for customers. Developed and implemented an internal tool for streamlined XML validation in .NET, significantly enhancing efficiency. Designed and deployed a Web API in .NET with a browser extension in JavaScript to streamline software updates and automate business processes.',
      logoUrl: 'assets/logos/ukg-logo.webp'
    },
    {
      date: 'Feb. 2024 - Present',
      title: 'Founder at PAH Solutions LLC',
      description: 'Led the creation of a JavaScript-based solution to automate food donation categorization for our college pantry, saving on average 45 seconds per item scan due to web scraping capabilities.',
      logoUrl: 'assets/logos/pah-logo.webp'
    },
    {
      date: 'June. 2023 - Present',
      title: 'Programming Tutor at Miami Dade College',
      description: 'Solidified and supplemented object-oriented programming principles and programming fundamentals in myself and students, raising grades and overall college proficiency through weekly workshops and tutoring.',
      logoUrl: 'assets/logos/mdc-logo.webp'
    },
    {
      date: 'June. 2023 - Dec. 2023',
      title: 'Student Research at Miami Dade College',
      description: 'Designed and collaboratively built a full-stack application in Flask, integrating simulated components from various team members including smart AC component and temperature, humidity, and occupancy sensors onto an administrator dashboard. Authored comprehensive technical documentation, ensuring rigorous planning and clarity in project development phases.',
      logoUrl: 'assets/logos/mdc-logo.webp'
    }
  ];

}
