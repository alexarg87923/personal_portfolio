import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './adminlogin.component.html',
  imports: [ReactiveFormsModule],
  standalone: true
})

export class AdminLoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.http.post('/api/admin/login', this.form.value, { observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response);
          if (response.status === 200) {
            // this.router.navigate(['/admin']);
          };
          if (response.status === 401) {
            // this.router.navigate(['/401']);
          };
        },
        error: error => {
          console.log('Error doing POST request', error);
        }
      });
    } else {
      console.log('Invalid form...');
    }
  }
}
