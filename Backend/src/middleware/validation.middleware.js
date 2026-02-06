const { validationResult } = require('express-validator');
const { sanitizeObject, containsDangerousPatterns } = require('../utils/sanitize');

/**
 * Middleware to sanitize all request body, query, and params
 */
const sanitizeInput = (req, res, next) => {
    try {
        // Sanitize request body
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body);
        }

        // Sanitize query parameters
        if (req.query && typeof req.query === 'object') {
            req.query = sanitizeObject(req.query);
        }

        // Sanitize URL parameters
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params);
        }

        next();
    } catch (error) {
        console.error('Sanitization error:', error);
        res.status(500).json({ message: 'Input validation error' });
    }
};

/**
 * Middleware to check for dangerous patterns in input
 */
const checkDangerousPatterns = (req, res, next) => {
    try {
        const checkObject = (obj, path = '') => {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];
                    const currentPath = path ? `${path}.${key}` : key;

                    if (typeof value === 'string' && containsDangerousPatterns(value)) {
                        throw new Error(`Dangerous pattern detected in ${currentPath}`);
                    } else if (typeof value === 'object' && value !== null) {
                        checkObject(value, currentPath);
                    }
                }
            }
        };

        // Check body
        if (req.body) {
            checkObject(req.body, 'body');
        }

        // Check query
        if (req.query) {
            checkObject(req.query, 'query');
        }

        next();
    } catch (error) {
        console.error('Dangerous pattern detected:', error.message);
        res.status(400).json({
            message: 'Invalid input detected. HTML tags and scripts are not allowed.',
            error: error.message
        });
    }
};

/**
 * Middleware to handle validation errors from express-validator
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }

    next();
};

/**
 * Combined validation middleware
 * Use this in routes: [sanitizeInput, checkDangerousPatterns, ...validationRules, handleValidationErrors]
 */
const validateRequest = [
    sanitizeInput,
    checkDangerousPatterns
];

module.exports = {
    sanitizeInput,
    checkDangerousPatterns,
    handleValidationErrors,
    validateRequest
};
