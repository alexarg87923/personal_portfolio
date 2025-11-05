import { RedisStore } from 'connect-redis';
import { type Express } from 'express';
import { getRedisConfig, getSessionConfig } from '../config/Config';
import { createClient } from 'redis';
import { modulesProvider } from '../modules/ModulesProvider';
import session from 'express-session';

export const createAndConnectRedis = async (): Promise<ReturnType<typeof createClient>> => {
  const client = createClient(getRedisConfig());

  client.on('error', (err) => console.error('Redis Client Error:', err));
  await client.connect();
  return client;
};

export async function setupSession(server: Express) {
  const redisStore = new RedisStore({
    client: await modulesProvider.getRedisClient(),
    prefix: 'portfolio:',
  });

  server.use(session(getSessionConfig(redisStore)));
};