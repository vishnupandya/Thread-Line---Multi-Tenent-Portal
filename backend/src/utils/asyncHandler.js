/**
 * Wraps an async route handler so thrown errors (sync or async)
 * automatically flow to Express's error pipeline via next().
 *
 * Usage:
 *   router.get('/me', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;