import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from '../src/main.server';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

require('dotenv').config();

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const commonEngine = new CommonEngine();
  const pool = new Pool({
    user: 'alexportfolio',
    host: 'localhost',
    database: 'portfolio',
    password: '',
    port: 5432,
  });


  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const query = 'INSERT INTO contact (name, email, message, timestamp) \
      VALUES ($1, $2, $3, NOW());'
      const values = [name, email, message]
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });

  // All regular routes use the Angular engine
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
