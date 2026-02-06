import DOMPurify from 'dompurify';

/**
 * Sanitize a string by removing HTML tags and scripts
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') {
        return input;
    }

    // Remove all HTML tags and scripts
    const sanitized = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: [], // No attributes allowed
        KEEP_CONTENT: true // Keep text content
    });

    return sanitized.trim();
}

/**
 * Sanitize rich text content (for HR Updates)
 * Allows safe HTML tags only
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
export function sanitizeRichText(html) {
    if (typeof html !== 'string') {
        return html;
    }

    // Allow only safe HTML tags
    const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
        ALLOWED_ATTR: ['href', 'target'],
        ALLOW_DATA_ATTR: false
    });

    return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
export function isValidURL(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export function isValidPhone(phone) {
    // Allow numbers, +, -, (, ), spaces
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
}

/**
 * Check if string contains dangerous patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if dangerous
 */
export function containsDangerousPatterns(input) {
    if (typeof input !== 'string') {
        return false;
    }

    const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i, // Event handlers
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /<applet/i,
        /vbscript:/i,
        /data:text\/html/i
    ];

    return dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Validation rules for different field types
 */
export const validationRules = {
    // Name fields (categories, applications, units, contacts)
    name: {
        pattern: /^[a-zA-Z0-9\s\-_&.]+$/,
        minLength: 2,
        maxLength: 150,
        message: 'Name can only contain letters, numbers, spaces, hyphens, underscores, dots, and ampersands'
    },

    // Code fields (units)
    code: {
        pattern: /^[a-zA-Z0-9\-_]+$/,
        minLength: 2,
        maxLength: 50,
        message: 'Code can only contain letters, numbers, hyphens, and underscores'
    },

    // Description fields
    description: {
        maxLength: 1000,
        message: 'Description must not exceed 1000 characters'
    },

    // Email fields
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },

    // Phone fields
    phone: {
        pattern: /^[\d\s\-\+\(\)]+$/,
        minLength: 10,
        maxLength: 20,
        message: 'Phone number can only contain numbers, +, -, (, ), and spaces'
    },

    // URL fields
    url: {
        message: 'Please enter a valid HTTP or HTTPS URL'
    }
};

/**
 * Validate input against a rule
 * @param {string} value - Value to validate
 * @param {string} ruleType - Type of validation rule
 * @returns {object} - { valid: boolean, message: string }
 */
export function validateInput(value, ruleType) {
    const rule = validationRules[ruleType];

    if (!rule) {
        return { valid: true, message: '' };
    }

    // Check for dangerous patterns first
    if (containsDangerousPatterns(value)) {
        return {
            valid: false,
            message: 'Input contains invalid characters or patterns'
        };
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
        return { valid: false, message: rule.message };
    }

    // Check min length
    if (rule.minLength && value.length < rule.minLength) {
        return {
            valid: false,
            message: `Must be at least ${rule.minLength} characters`
        };
    }

    // Check max length
    if (rule.maxLength && value.length > rule.maxLength) {
        return {
            valid: false,
            message: `Must not exceed ${rule.maxLength} characters`
        };
    }

    // Special validation for URLs
    if (ruleType === 'url' && !isValidURL(value)) {
        return { valid: false, message: rule.message };
    }

    return { valid: true, message: '' };
}

/**
 * Sanitize form data before submission
 * @param {object} formData - Form data to sanitize
 * @returns {object} - Sanitized form data
 */
export function sanitizeFormData(formData) {
    const sanitized = {};

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const value = formData[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            } else if (typeof value === 'object' && value !== null) {
                sanitized[key] = sanitizeFormData(value);
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
}
