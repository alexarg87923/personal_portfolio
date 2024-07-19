import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';

import bootstrap from '../client/src/main.server';
import ContactRoutes from './routes/ContactRoutes';
import { environment } from './environments/environment.prod';
import * as bodyParser from 'body-parser';

export function app(): express.Express {
  const server = express();
  const browserDistFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');
  const commonEngine = new CommonEngine();

  // Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Serve static files
  server.use(express.static(browserDistFolder));

  // Set view engine and views directory
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // API routes
  server.use('/api', ContactRoutes);

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }], // Adjusted for proper base href
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

function run(): void {
  const port = environment.PORT || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port} in ${environment.mode} mode.`);
  });
}

run();
