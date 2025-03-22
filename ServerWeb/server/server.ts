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
import cors from 'cors';
import MainRoute from './routes/MainRoute';
import { initialize_database } from './databases/pg';

export async function app(): Promise<express.Express> {
  const server = express();
  const browserDistFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');
  const commonEngine = new CommonEngine();

  var corsOptions;
  var sessionOptions;

  if (environment.MODE === 'development') {
    corsOptions = {
      origin: 'http://localhost:4200',
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: ['Content-Type', 'Authorization', '*']
    };

      sessionOptions = {
          store: redisStore,
          resave: false,
          saveUninitialized: false,
          secret: environment.REDIS_SECRET,
          cookie: { secure: false, maxAge: 60000, httpOnly: false }
      };
    console.log('CORS and session set up in development mode');
    } else {
      corsOptions = {
        origin: 'http://localhost',
      };

      sessionOptions = {
          store: redisStore,
          resave: false,
          saveUninitialized: false,
          secret: environment.REDIS_SECRET,
          cookie: { secure: true, maxAge: 60000, httpOnly: true }
      };
    console.log('CORS and session in production mode');
  };

  await initialize_database();

  // Middleware
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(cors(corsOptions));
  server.use(session(sessionOptions));

  // API routes
  server.use('/api', MainRoute);

  if (environment.MODE === 'production') {
    // Set view engine and views directory
    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Serve static files
    server.use(express.static(browserDistFolder));

    // All regular routes use the Angular engine
    server.get('**', (req, res, next) => {
      console.log(req.cookies);
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

async function run(): Promise<void> {
  const port = environment.PORT || 4000;
  const server = await app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port} in ${environment.MODE} mode.`);
  });
};

run();
