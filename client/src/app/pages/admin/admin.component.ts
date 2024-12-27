import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { IAbout, IExperience, IProject, ISkill } from '../../../../../shared/interfaces/IFormData';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [HttpClientModule, ReactiveFormsModule, FormsModule, CommonModule],
  standalone: true
})

export class AdminComponent implements OnInit {
  aboutSection: IAbout;
  experienceSection: Array<IExperience>;
  projectsSection: Array<IProject>;
  skillsSection: Array<ISkill>;

  activeIndexExperience: number | null = null;
  toggleExperience(index: number): void {
    this.activeIndexExperience = this.activeIndexExperience === index ? null : index;
  }

  activeIndexProjects: number | null = null;
  toggleProjects(index: number): void {
    this.activeIndexProjects = this.activeIndexProjects === index ? null : index;
  }

  activeIndexSkills: number | null = null;
  toggleSkills(index: number): void {
    this.activeIndexSkills = this.activeIndexSkills === index ? null : index;
  }

  constructor(private http: HttpClient) {
    this.aboutSection = { id: -1, summary: '' };
    this.experienceSection = [];
    this.projectsSection = [];
    this.skillsSection = [];
  }

  ngOnInit(): void {
    this.http.get<IFormData>('http://localhost:4000/api/admin')
    .subscribe({
      next: response => {
        console.log(response);
        this.aboutSection = response.about[0];
        this.experienceSection = response.experience;
        this.projectsSection = response.project;
        this.skillsSection = response.skill;
      },
      error: error => {
        console.error('Error doing GET request', error);
        alert('Failed to do GET request');
      }
    })
  }
}

interface IFormData {
  about: Array<IAbout>,
  experience: Array<IExperience>,
  project: Array<IProject>,
  skill: Array<ISkill>
}
