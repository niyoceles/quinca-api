import redisClient from './redis';

/**
 * Clears Redis cache for items to ensure data consistency
 */
export const clearItemCache = async () => {
  try {
    const keys = await redisClient.keys('items_page_*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    await redisClient.del('home_items');
  } catch (error) {
    // Silence cache errors to prevent breaking the flow
    console.warn('Cache clearing error:', error.message);
  }
};
