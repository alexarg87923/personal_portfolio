import { getRedisConfig } from '../config/Config';
import { createClient } from 'redis';

export const createAndConnectRedis = async (): Promise<ReturnType<typeof createClient>> => {
  const client = createClient(getRedisConfig());

  client.on('error', (err) => console.error('Redis Client Error:', err));
  await client.connect();
  return client;
};