import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { IAbout, IExperience, IProject, ISkill } from '../../shared/interfaces/IFormData';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [HttpClientModule, FormsModule, CommonModule],
  standalone: true
})

export class AdminComponent implements OnInit {
  fetchedData: IFormData = { about: [ { id: -1, summary: '' } ], experience: [], project: [], skill: [] };
  original: IFormData = { about: [], experience: [], project: [], skill: [] };
  changed: ChangedFormData = { about: [], experience: [], project: [], skill: [] };

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

  constructor(private http: HttpClient, private router: Router) {}

  onChange(section: keyof IFormData, index: number, field: string, event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    const origValue = this.original[section][index][field as keyof (IExperience|IProject|ISkill|IAbout)];

    if (newValue !== String(origValue)) {
      this.changed[section][index] = {
        ...this.changed[section][index],
        [field]: newValue
      };

      if (!this.changed[section][index]['id']) {
        const origID = this.original[section][index]['id'];
        this.changed[section][index]['id'] = origID;
      }

    } else {
      if (this.changed[section][index]) {
        delete this.changed[section][index][field as keyof (IExperience|IProject|ISkill|IAbout)];

        if (Object.keys(this.changed[section]![index]!).length === 1) {
          this.changed[section]!.splice(index, 1);
        }
      }
    }
  }

  ngOnInit(): void {
    this.http.get<IFormData>('/api/admin', { withCredentials: true})
    .subscribe({
      next: response => {
        if (response !== null && !!response) {
          this.fetchedData = response;
          this.original = JSON.parse(JSON.stringify(response));

        };
      },
      error: error => {
        console.error('Error doing GET request', error.message);
        this.router.navigate(['/500']);
      }
    });
  }

  onSubmit(): void {
    if (Object.keys(this.changed).length > 0) {
      console.log('Saving changes:', this.changed);
      this.http.post('/api/admin', this.changed, { withCredentials: true })
        .subscribe({
          next: response => {
            console.log('Changes saved successfully:', response);
            this.original = JSON.parse(JSON.stringify(this.fetchedData));
            this.changed = { about: [], experience: [], project: [], skill: [] };
          },
          error: error => {
            console.error('Error saving changes:', error);
          }
        });
    } else {
      console.log('No changes to save.');
    }
  }
}

interface ChangedFormData {
  about: Partial<IAbout>[];
  experience: Partial<IExperience>[];
  project: Partial<IProject>[];
  skill: Partial<ISkill>[];
}

interface IFormData {
  about: Array<IAbout>,
  experience: Array<IExperience>,
  project: Array<IProject>,
  skill: Array<ISkill>
}
