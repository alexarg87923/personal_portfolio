import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [ReactiveFormsModule],
  standalone: true
})
export class ContactComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  };

  onSubmit(): void {
    if (this.form.valid) {
      this.http
      .post('/api/contact', this.form.value)
      .subscribe({
        next: response => {
          console.log('Form submitted successfully', response);
        },
        error: error => {
          console.error('Error submitting form', error);
        }
      });
    }
  };
};
