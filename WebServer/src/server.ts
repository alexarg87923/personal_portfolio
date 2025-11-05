import express, { type NextFunction, type Request, type Response } from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import cors from 'cors';
import { environment } from './server/environments/Environment';
import { initializeDatabase } from './server/services/PostgresInitializationService';
import MainRoute from './server/routes/MainRoute';
import { createNodeRequestHandler, isMainModule, AngularNodeAppEngine, writeResponseToNodeResponse } from '@angular/ssr/node';
import { modulesProvider } from './server/modules/ModulesProvider';
import { setupSession } from './server/utils/Utils';
import { getCorsConfig, getPinoHttpConfig } from './server/config/Config';
import pinoHttp from 'pino-http';

// Only define basic constants that are safe to execute
const __dirname = dirname(fileURLToPath(import.meta.url));
const BROWSER_DIST = join(__dirname, '../browser');
const logger = modulesProvider.getLogger();
const { MODE, PORT } = environment;

// Function to create and configure the server
const serverObj = (async () => {
  const server = express();
  const angularEngine = new AngularNodeAppEngine();

  // Middleware
  logger.info({ file: 'server.ts', action: 'InitMiddleWare' }, 'Setting up middleware...');
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cors(getCorsConfig()));
  server.use(pinoHttp(getPinoHttpConfig(logger))); 

  // Session for authentication
  logger.info({ file: 'server.ts', action: 'InitSession' }, 'Setting up session with Redis...');
  await setupSession(server);
  
  // Database
  logger.info({ file: 'server.ts', action: 'InitDb', db: 'Postgres' }, 'Initializing PostgreSQL DB...');
  await initializeDatabase();

  // API routes
  server.use('/api/v1', (req, res, next) => {
    req.log.info({file: 'server.ts', 'action': '/api'}, 'API route call...');
    return MainRoute(req, res, next)
  });

  server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Don't send error details in production
    const message = MODE === 'development'
      ? err.message
      : 'Internal server error';

    res.status(500).json({ error: message });
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
    req.log.info({file: 'server.ts', 'action': 'angular-hydration'}, 'Angular route call...');
    next();
  });

  // Handle all other requests by rendering the Angular application
  server.use('/**', (req, res, next) => {
    const { protocol, originalUrl, headers, cookies } = req;
    req.log.info("[ANGULAR RENDER] " + req.method + " " + req.originalUrl);
    req.log.info('Protocol: ' + protocol);
    req.log.info('Url: ' + originalUrl);
    req.log.info('Headers: ' + headers);
    req.log.info('Cookies: ' + cookies);

    angularEngine
      .handle(req)
      .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
      .catch(next);
  });

  return server;
})();

// Cleanup deps if program crashes
process.on('SIGTERM', async () => {
  await modules.cleanup();
  process.exit(0);
});

// Only run when this file is executed directly
if (isMainModule(import.meta.url)) {
  const server = await serverObj;
  const port = PORT || 4000;

  // Initialize database and start server
  server.listen(port, () => {
    logger.info(`Node Express server listening on http://localhost:${port} in ${MODE} mode.`);
  });
}

// For SSR/build purposes, export a request handler
export const reqHandler = (async () => {
  const app = await serverObj;
  return createNodeRequestHandler(app);
})();