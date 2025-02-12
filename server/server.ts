import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import session from 'express-session';
import bootstrap from '../client/src/main.server';
import { environment } from './environments/environment.prod';
import * as bodyParser from 'body-parser';
import redisStore from './databases/redis';
import ContactRoutes from './routes/ContactRoutes';
import AdminRoutes from './routes/AdminRoutes';
import MainRoute from './routes/MainRoute';

import { initialize_database } from './databases/pg';

export function app(): express.Express {
  const server = express();
  const browserDistFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');
  const commonEngine = new CommonEngine();
  initialize_database();

  // Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(
    session({
      store: redisStore,
      resave: false,
      saveUninitialized: true,
      secret: environment.REDIS_SECRET,
    })
  );

  // API routes
  server.use('/api', ContactRoutes);
  server.use('/api', AdminRoutes);
  server.use('/api', MainRoute);

  if (environment.MODE === 'production') {
    // Set view engine and views directory
    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Serve static files
    server.use(express.static(browserDistFolder));

    // All regular routes use the Angular engine
    server.get('**', (req, res, next) => {
      const { protocol, originalUrl, headers } = req;

      commonEngine
        .render({
          bootstrap,
          documentFilePath: indexHtml,
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: browserDistFolder,
          providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
        })
        .then(html => res.send(html))
        .catch(err => next(err));
    });
  };

  return server;
};

function run(): void {
  const port = environment.PORT || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port} in ${environment.MODE} mode.`);
  });
};

run();
