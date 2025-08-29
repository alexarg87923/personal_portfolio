import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import session from 'express-session';
import cors from 'cors';

import { environment } from './server/environments/environment';
import { initialize_database } from './server/databases/pg';
import redisStore from './server/databases/redis';
import MainRoute from './server/routes/MainRoute';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const DIST_DIR         = join(__dirname, '..');                       // e.g., dist/
const APP_DIST         = join(DIST_DIR, 'portfolio');                 // dist/portfolio
const BROWSER_DIST     = join(APP_DIST, 'browser');                   // dist/portfolio/browser
const SSR_BUNDLE_PATH  = join(APP_DIST, 'ssr-bundle', 'main.js');     // built from main.server.ts

export async function app(): Promise<express.Express> {
  const server = express();

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
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors(corsOptions));
  server.use(session(sessionOptions));

  // API routes
  server.use('/api', MainRoute);

  if (environment.MODE === 'production') {
    await import('@angular/compiler');
    const { CommonEngine } = await import('@angular/ssr/node');
    const { default: bootstrap } = await import(SSR_BUNDLE_PATH);

    const commonEngine = new CommonEngine();

    // Set view engine and views directory
    server.set('view engine', 'html');
    server.set('views', BROWSER_DIST);

    // Serve static files
    server.use(express.static(BROWSER_DIST, {
      maxAge: '1y',
      index: 'index.html'
    }));

    // All regular routes use the Angular engine
    server.get('**', async (req, res, next) => {
      console.log('Cookies: ' + req.cookies);
      const { protocol, originalUrl, headers } = req;

      commonEngine
        .render({
          bootstrap,
          documentFilePath: join(BROWSER_DIST, 'index.html'),
          url: `${protocol}://${headers.host}${originalUrl}`,
          publicPath: BROWSER_DIST,
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
