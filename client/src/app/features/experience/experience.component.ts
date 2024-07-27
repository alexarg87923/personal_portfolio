import { Component } from '@angular/core';

interface WorkExperience {
  date: string;
  title: string;
  description: string;
  logoUrl: string;
}

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html'
})

export class ExperienceComponent {
  workExperiences: WorkExperience[] = [
    {
      date: 'Jan. 2024 - Apr. 2024',
      title: 'Software Engineer Intern at Ultimate Kronos Group',
      description: 'Collaborated closely with a team of engineers and business analysts to debug SQL and C# enterprise level software, ensuring minimal downtime and prompt resolution of problems for customers. Developed and implemented an internal tool for streamlined XML validation in .NET, significantly enhancing efficiency. Designed and deployed a Web API in .NET with a browser extension in JavaScript to streamline software updates and automate business processes.',
      logoUrl: 'assets/ukg_logo.webp'
    },
    {
      date: 'Feb. 2024 - June. 2024',
      title: 'Founder at PAH Solutions LLC',
      description: 'Led the creation of a JavaScript-based solution to automate food donation categorization for our college pantry, saving on average 45 seconds per item scan due to web scraping capabilities.',
      logoUrl: 'assets/pah_solutions_logo.webp'
    },
    {
      date: 'June. 2023 - June. 2024',
      title: 'Programming Tutor at Miami Dade College',
      description: 'Solidified and supplemented object-oriented programming principles and programming fundamentals in myself and students, raising grades and overall college proficiency through weekly workshops and tutoring.',
      logoUrl: 'assets/miami_dade_college_logo.webp'
    },
    {
      date: 'June. 2023 - Dec. 2023',
      title: 'Student Research at Miami Dade College',
      description: 'Designed and collaboratively built a full-stack application in Flask, integrating simulated components from various team members including smart AC component and temperature, humidity, and occupancy sensors onto an administrator dashboard. Authored comprehensive technical documentation, ensuring rigorous planning and clarity in project development phases.',
      logoUrl: 'assets/miami_dade_college_logo.webp'
    },
    {
      date: 'Jan. 2023 - Dec. 2023',
      title: 'President at Society of Hispanic Professional Engineers (SHPE)',
      description: 'Collaborated with student clubs to co-host events and work on projects, resulting in a STEM community of 381 members. Planned technical workshops, averaging 25 participants per session, and optimized the application process by deploying a web application. High school outreach efforts led to the creation of 2 STEM clubs, collectively fostering 60 students and leading to mentorship opportunities.',
      logoUrl: 'assets/shpe_logo.webp'
    }
  ];

}
