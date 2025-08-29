import { PortfolioDashboardComponent } from './portfolio/portfolio.component';

import { AdminLayoutComponent } from './admin/admin-layout.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './admin/login/admin-login.component';
import { AdminLogoutComponent } from './admin/logout/admin-logout.component';

import { PageNotFoundComponent } from './errors/404/404.component';
import { UnauthorizedAccessComponent } from './errors/401/401.component';
import { UnexpectedServerErrorComponent } from './errors/500/500.component';

import { type Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PortfolioDashboardComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: AdminDashboardComponent },
      { path: 'login', component: AdminLoginComponent },
      { path: 'logout', component: AdminLogoutComponent }
    ],
   },
  { path: '401', component: UnauthorizedAccessComponent },
  { path: '500', component: UnexpectedServerErrorComponent },
  { path: '**', component: PageNotFoundComponent }
];
