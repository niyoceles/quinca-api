import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const client = createClient({
  url: redisUrl
});

client.on('error', (err) => console.error('Redis Client Error', err));

// Connect in the background to avoid ERR_REQUIRE_ASYNC_MODULE when this module is required/imported.
// Babel transpilation often converts imports to synchronous requires.
client.connect().catch((err) => {
  console.error('Initial Redis connection failed:', err);
});

export default client;
