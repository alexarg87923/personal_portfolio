import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/login',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/logout',
    renderMode: RenderMode.Server,
  },
  {
    path: '401',
    renderMode: RenderMode.Server,
  },
  {
    path: '500',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];