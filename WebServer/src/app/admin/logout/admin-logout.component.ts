import { Component, type OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-logout',
  templateUrl: './admin-logout.component.html',
  standalone: true
})
export class AdminLogoutComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.post('/api/admin/logout', {}, { observe: 'response' })
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.status !== 200) {
            this.router.navigate(['/500']);
          }
        },
        error: (error) => {
          console.error('Logout failed', error);
          this.router.navigate(['/500']);
        }
      });
  }
}
