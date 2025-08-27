import { PortfolioComponent } from './portfolio/portfolio.component';
import { AdminComponent } from './admin/admin.component';
import { AdminLoginComponent } from './admin/login/adminlogin.component';
import { PageNotFoundComponent } from './errors/404/404.component';
import { UnauthorizedAccessComponent } from './errors/401/401.component';
import { UnexpectedServerErrorComponent } from './errors/500/500.component';
import { type Routes } from '@angular/router';
import { AdminLogoutComponent } from './admin/logout/logout.component';

export const routes: Routes = [
  { path: '', component: PortfolioComponent },
  { 
    path: 'admin', 
    component: AdminComponent,
    children: [
      { path: 'login', component: AdminLoginComponent },
      { path: 'logout', component: AdminLogoutComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ],
   },
  { path: '401', component: UnauthorizedAccessComponent },
  { path: '500', component: UnexpectedServerErrorComponent },
  { path: '**', component: PageNotFoundComponent },
];
