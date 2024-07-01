const redis = require('../utils/redis');
const { promisify } = require('util');

const redisSetAsync = promisify(redis.set).bind(redis);
const redisGetAsync = promisify(redis.get).bind(redis);
const redisDelAsync = promisify(redis.del).bind(redis);

afterAll(async () => {
  await redis.quit();
});

describe('Redis Client Tests', () => {
  it('should set and get a value from Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await redisSetAsync(key, value);
    const result = await redisGetAsync(key);

    expect(result).toBe(value);
  });

  it('should delete a value from Redis', async () => {
    const key = 'testKey';

    await redisSetAsync(key, 'toDelete');
    await redisDelAsync(key);

    const result = await redisGetAsync(key);

    expect(result).toBeNull();
  });
});
