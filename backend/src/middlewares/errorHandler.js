import mongoose from 'mongoose';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

/**
 * Global error handler. Mounted LAST in app.js.
 * Converts every possible error type into a consistent response:
 *   { success: false, message, code, details? }
 */
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, _next) {
  let error = err;

  // Mongoose: bad ObjectId
  if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest('Invalid resource identifier', {
      field: err.path,
    });
  }
  // Mongoose: validation failed
  else if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Validation failed', details);
  }
  // Mongo: duplicate key
  else if (err && err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`Duplicate value for ${field}`);
  }
  // JWT errors
  else if (err && err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  } else if (err && err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }
  // Unknown → internal
  else if (!(err instanceof ApiError)) {
    error = ApiError.internal(
      env.IS_PROD ? 'Internal server error' : err.message
    );
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
  };
  if (error.details) payload.details = error.details;
  if (!env.IS_PROD && err.stack) payload.stack = err.stack;

  if (statusCode >= 500) {
    console.error('💥 Unhandled error:', err);
  }

  res.status(statusCode).json(payload);
}