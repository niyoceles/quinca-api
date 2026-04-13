import redis from 'redis';
import bluebird from 'bluebird';
import dotenv from 'dotenv';

dotenv.config();

bluebird.promisifyAll(redis);

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

client.on('error', () => {});

export default client;
