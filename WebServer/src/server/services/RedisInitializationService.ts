import { type RedisClientType } from 'redis';
import { getRedisClient } from '../providers/ProvidesRedisClient';

let connectPromise: Promise<RedisClientType> | null = null;

export async function ensureRedisConnected(): Promise<RedisClientType> {
  console.log('[REDIS INSIDE ensure start]', new Date().toISOString());
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

  console.log('[REDIS INSIDE ensure done]', new Date().toISOString());

  return c;
};