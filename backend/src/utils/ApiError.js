/**
 * Custom application error.
 * Every expected error thrown in controllers/middlewares must be an ApiError.
 * Unexpected errors (bugs, DB crashes) fall through to errorHandler as-is.
 */
export default class ApiError extends Error {
  /**
   * @param {number} statusCode  HTTP status code
   * @param {string} message     Human-readable message (safe for client)
   * @param {string} code        Machine-readable code (e.g. FORBIDDEN, NOT_FOUND)
   * @param {Array}  details     Optional field-level details (for validation)
   */
  constructor(statusCode, message, code = 'ERROR', details = undefined) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  // ---- Convenience factories ----
  static badRequest(message = 'Bad request', details) {
    return new ApiError(400, message, 'BAD_REQUEST', details);
  }
  static unauthorized(message = 'Unauthenticated') {
    return new ApiError(401, message, 'UNAUTHENTICATED');
  }
  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, message, 'NOT_FOUND');
  }
  static conflict(message = 'Conflict') {
    return new ApiError(409, message, 'CONFLICT');
  }
  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL_ERROR');
  }
}