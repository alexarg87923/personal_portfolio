import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';
import { environment } from '../environments/environment';

let redisClient = createClient({
  url: `redis://${environment.REDIS_DB_USER}:${environment.REDIS_DB_PASSWORD}@${environment.DB_HOST}:${environment.REDIS_DB_PORT}`
});
redisClient.on('error', (err) => console.error('Redis Client Error: ', err));
redisClient.connect().catch(() => {
  console.error('Error connecting Redis client...');
});

let redisStore = new RedisStore({
  client: redisClient,
  prefix: 'portfolio:',
});

export default redisStore;
