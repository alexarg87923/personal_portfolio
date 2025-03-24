import { LandingComponent } from './landing/landing.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/login/adminlogin.component';
import { PageNotFoundComponent } from './errors/404/404.component';
import { UnauthorizedAccessComponent } from './errors/401/401.component';
import { Routes } from '@angular/router';
import { AdminLogoutComponent } from './admin/logout/logout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/logout', component: AdminLogoutComponent },
  { path: '401', component: UnauthorizedAccessComponent },
  { path: '500', component: UnauthorizedAccessComponent },
  { path: '**', component: PageNotFoundComponent },
];
