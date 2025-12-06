/**
 * Validation Middleware
 * Validates request data before passing to controller
 */

const { validateData } = require('@utils/validator');
const validationRules = require('@utils/validationRules');
const { sendError } = require('@utils/response');

/**
 * Creates a validation middleware for a specific endpoint
 * @param {string} resource - Resource name (e.g., 'user')
 * @param {string} action - Action name (e.g., 'create', 'update')
 */
const validate = (resource, action) => {
  return (req, res, next) => {
    const rules = validationRules[resource]?.[action];

    if (!rules) {
      // If no rules defined, proceed
      return next();
    }

    const data = {
      ...req.body,
      ...req.params,
      ...req.query,
    };

    const validation = validateData(data, rules);

    if (!validation.valid) {
      return sendError(res, validation.errors, 'Validation Error', 422);
    }

    // Attach validated data to request
    req.validatedData = validation.validatedData;
    next();
  };
};

module.exports = {
  validate,
};
