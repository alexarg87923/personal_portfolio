import { LandingComponent } from './pages/landing/landing.component';
import { AdminComponent } from './pages/admin/admin.component';
import { PageNotFoundComponent } from './pages/404/404.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', component: PageNotFoundComponent },
];
