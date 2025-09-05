import { environment } from '../environments/Environment';
import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!client) {
    client = createClient({
      url: `redis://${environment.REDIS_DB_USER}:${environment.REDIS_DB_PASSWORD}@${environment.MODE === 'development' ? 'localhost' : environment.REDIS_DB_HOST}:${environment.REDIS_DB_PORT}`
    });
    client.on('error', (err) => console.error('Redis Client Error:', err));
  }
  return client;
};