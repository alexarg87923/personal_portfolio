import express, { Express } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import session from 'express-session';
import cors from 'cors';
import { RedisStore } from 'connect-redis';
import { environment } from './server/environments/environment';
import { initialize_database } from './server/databases/pg';
import { ensureRedisConnected } from './server/databases/redis';
import MainRoute from './server/routes/MainRoute';
import { createNodeRequestHandler, isMainModule, AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node';

// Only define basic constants that are safe to execute
const __dirname = dirname(fileURLToPath(import.meta.url));
const BROWSER_DIST = join(__dirname, '../browser');

// Function to create and configure the server
function createServer() {
  const server = express();
  const angularEngine = new AngularNodeAppEngine();
  
  // Configure CORS options
  const corsOptions = environment.MODE === 'development' ? {
    origin: 'http://localhost:4000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', '*']
  } : {
    origin: 'http://localhost:4000',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', '*']
  };

  console.log(`CORS and session set up in ${environment.MODE} mode`);

  // Middleware
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors(corsOptions));
  setupSession(server);

  // API routes
  server.use('/api', (req, res, next) => {
    console.log("[API] " + req.method + " " + req.originalUrl);
    return MainRoute(req, res, next)
  });

  // Set view engine and views directory
  server.set('view engine', 'html');
  server.set('views', BROWSER_DIST);

  // Serve static files from /browser
  server.use(
    express.static(BROWSER_DIST, {
      maxAge: '1y',
      index: false,
      redirect: false
    })
  );

  server.use((req, res, next) => {
    console.log("[NON-API/ANGULAR] " + req.method + " " + req.originalUrl);
    next();
  });

  // Handle all other requests by rendering the Angular application
  server.use('/**', (req, res, next) => {
    const { protocol, originalUrl, headers, cookies } = req;
    console.log("[ANGULAR RENDER] " + req.method + " " + req.originalUrl);
    console.log('Protocol: ' + protocol);
    console.log('Url: ' + originalUrl);
    console.log('Headers: ' + headers);
    console.log('Cookies: ' + cookies);

    angularEngine
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  });

  return server;
}

async function setupSession(server: Express) {
  const redisClient = await ensureRedisConnected();
  
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'portfolio:',
  });

  server.use(session({
    store: redisStore,
    resave: false,
    saveUninitialized: false,
    secret: environment.REDIS_SECRET,
    cookie: environment.MODE === 'development' 
      ? { secure: false, maxAge: 60000, httpOnly: false }
      : { secure: true, maxAge: 60000, httpOnly: true }
  }));

  console.log('Session middleware configured with Redis store');
};

// Only run when this file is executed directly
if (isMainModule(import.meta.url)) {
  const server = createServer();
  const port = environment.PORT || 4000;
  
  // Initialize database and start server
  initialize_database();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port} in ${environment.MODE} mode.`);
  });
}

// For SSR/build purposes, export a request handler
export const reqHandler = createNodeRequestHandler(createServer());