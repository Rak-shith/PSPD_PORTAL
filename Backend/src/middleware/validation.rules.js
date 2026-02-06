const { body } = require('express-validator');
const { isValidEmail, isValidURL } = require('../utils/sanitize');

// Validation rules for creating/updating categories
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_&]+$/).withMessage('Name contains invalid characters. Only letters, numbers, spaces, hyphens, underscores, and ampersands are allowed'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
];

// Validation rules for creating/updating applications
const applicationValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Application name is required')
        .isLength({ min: 2, max: 150 }).withMessage('Name must be between 2 and 150 characters')
        .matches(/^[a-zA-Z0-9\s\-_&.]+$/).withMessage('Name contains invalid characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),

    body('url')
        .trim()
        .notEmpty().withMessage('URL is required')
        .custom((value) => {
            if (!isValidURL(value)) {
                throw new Error('Invalid URL format. Only HTTP and HTTPS URLs are allowed');
            }
            if (value.toLowerCase().includes('javascript:') || value.toLowerCase().includes('data:')) {
                throw new Error('Dangerous URL detected');
            }
            return true;
        }),

    body('image_url')
        .optional()
        .trim()
        .custom((value) => {
            if (value && !isValidURL(value)) {
                throw new Error('Invalid image URL format');
            }
            return true;
        }),

    body('category_id')
        .notEmpty().withMessage('Category is required')
        .isInt({ min: 1 }).withMessage('Invalid category ID'),

    body('owner_email')
        .trim()
        .notEmpty().withMessage('Owner email is required')
        .custom((value) => {
            if (!isValidEmail(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        })
];

// Validation rules for creating/updating units
const unitValidation = [
    body('code')
        .trim()
        .notEmpty().withMessage('Unit code is required')
        .isLength({ min: 2, max: 50 }).withMessage('Code must be between 2 and 50 characters')
        .matches(/^[a-zA-Z0-9\-_]+$/).withMessage('Code can only contain letters, numbers, hyphens, and underscores'),

    body('name')
        .trim()
        .notEmpty().withMessage('Unit name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_&]+$/).withMessage('Name contains invalid characters')
];

// Validation rules for creating/updating contacts
const contactValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Contact name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s.]+$/).withMessage('Name can only contain letters, spaces, and dots'),

    body('designation')
        .trim()
        .notEmpty().withMessage('Designation is required')
        .isLength({ max: 100 }).withMessage('Designation must not exceed 100 characters'),

    body('department')
        .trim()
        .notEmpty().withMessage('Department is required')
        .isLength({ max: 100 }).withMessage('Department must not exceed 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .custom((value) => {
            if (!isValidEmail(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
        .isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10 and 20 characters')
];

// Validation rules for creating/updating support teams
const supportValidation = [
    body('team_name')
        .trim()
        .notEmpty().withMessage('Team name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Team name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_&]+$/).withMessage('Team name contains invalid characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .custom((value) => {
            if (!isValidEmail(value)) {
                throw new Error('Invalid email format');
            }
            return true;
        }),

    body('phone')
        .optional()
        .trim()
        .matches(/^[\d\s\-\+\(\)]*$/).withMessage('Invalid phone number format')
        .isLength({ max: 20 }).withMessage('Phone number must not exceed 20 characters')
];

// Validation rules for creating/updating holidays
const holidayValidation = [
    body('holiday_date')
        .notEmpty().withMessage('Holiday date is required')
        .isISO8601().withMessage('Invalid date format'),

    body('name')
        .trim()
        .notEmpty().withMessage('Holiday name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_&.]+$/).withMessage('Name contains invalid characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),

    body('unit_ids')
        .isArray({ min: 1 }).withMessage('At least one unit must be selected')
        .custom((value) => {
            if (!value.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('Invalid unit IDs');
            }
            return true;
        })
];

// Validation rules for creating/updating HR updates
const hrUpdateValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),

    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ min: 10, max: 10000 }).withMessage('Content must be between 10 and 10000 characters'),

    body('start_date')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Invalid start date format'),

    body('end_date')
        .notEmpty().withMessage('End date is required')
        .isISO8601().withMessage('Invalid end date format')
        .custom((value, { req }) => {
            if (new Date(value) < new Date(req.body.start_date)) {
                throw new Error('End date must be after start date');
            }
            return true;
        })
];

module.exports = {
    categoryValidation,
    applicationValidation,
    unitValidation,
    contactValidation,
    supportValidation,
    holidayValidation,
    hrUpdateValidation
};
