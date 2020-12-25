import redis from 'redis';
import bluebird from 'bluebird';
import dotenv from 'dotenv';

dotenv.config();

bluebird.promisifyAll(redis);
const client = redis.createClient();
export default client;
