import { createClient, type RedisClientType } from 'redis';
import { environment } from '../environments/environment';

let client: RedisClientType | null = null;
let connectPromise: Promise<RedisClientType> | null = null;

export function getRedisClient(): RedisClientType {
  if (!client) {
    client = createClient({
      url: `redis://${environment.REDIS_DB_USER}:${environment.REDIS_DB_PASSWORD}@${environment.REDIS_DB_HOST}:${environment.REDIS_DB_PORT}`
    });
    client.on('error', (err) => console.error('Redis Client Error:', err));
  }
  return client;
}

export async function ensureRedisConnected(): Promise<RedisClientType> {
  const c = getRedisClient();
  
  // Already connected?
  if ((c as any).isOpen) return c;
  
  // Start (or reuse) one connection attempt
  if (!connectPromise) {
    connectPromise = c.connect();
  }
  
  try {
    await connectPromise;
  } catch (err) {
    // reset so a later call can retry
    connectPromise = null;
    throw err;
  }
  
  return c;
};