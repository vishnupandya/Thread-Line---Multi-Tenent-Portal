import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

/**
 * Validation results middleware.
 * Place AFTER validation chains, BEFORE the controller.
 *
 * Usage:
 *   router.post('/register',
 *     [...body('email').isEmail()],
 *     validate,
 *     controller
 *   )
 */
function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  // Map errors to a clean shape: [{ field, message }]
  const details = result.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  next(ApiError.badRequest('Validation failed', details));
}

export default validate;