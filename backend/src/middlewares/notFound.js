import ApiError from '../utils/ApiError.js';

/**
 * Catch-all for unmatched routes.
 * Mounted AFTER all routes, BEFORE errorHandler.
 */
export default function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}