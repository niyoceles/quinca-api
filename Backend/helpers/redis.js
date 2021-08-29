import redis from 'redis';
import bluebird from 'bluebird';
import dotenv from 'dotenv';

dotenv.config();

bluebird.promisifyAll(redis);
const client = redis.createClient();

client.on('error', (err) => {
  console.log('Error ' + err);
});
export default client;
