// file: utils/rateLimiter.js
const messageRateMap = new Map();

export function canSendMessage(userId) {
  const now = Date.now();
  const window = 60000;
  const limit = 10;

  if (!messageRateMap.has(userId)) {
    messageRateMap.set(userId, []);
  }

  const timestamps = messageRateMap
    .get(userId)
    .filter((t) => now - t < window);

  if (timestamps.length >= limit) return false;

  timestamps.push(now);
  messageRateMap.set(userId, timestamps);

  return true;
}