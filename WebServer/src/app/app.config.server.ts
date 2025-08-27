import { mergeApplicationConfig, type ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { APP_BASE_HREF } from '@angular/common';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    { provide: APP_BASE_HREF, useValue: '/' },
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
