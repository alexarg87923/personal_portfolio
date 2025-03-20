import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [HttpClientModule, ReactiveFormsModule],
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
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.http.post('/api/contact', this.form.value)
        .subscribe({
          next: response => {
            console.log('Form submitted successfully', response);
            alert('Form submitted successfully!');
          },
          error: error => {
            console.error('Error submitting form', error);
            alert('Failed to submit form');
          }
        });
    }
  }
}
