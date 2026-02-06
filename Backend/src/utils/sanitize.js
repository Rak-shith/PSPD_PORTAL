const validator = require('validator');

/**
 * Sanitize a string by removing HTML tags and scripts
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
function sanitizeString(input) {
    if (typeof input !== 'string') {
        return input;
    }

    let sanitized = input;

    // Remove script tags and their content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove all HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');

    // Remove data: protocol for HTML
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    // Decode HTML entities to prevent double encoding
    sanitized = sanitized
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&');

    // Remove any remaining HTML tags after decoding
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    return sanitized.trim();
}

/**
 * Sanitize an object recursively
 * @param {object} obj - The object to sanitize
 * @returns {object} - Sanitized object
 */
function sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    const sanitized = {};
    for (const key in obj) {
        // Use Object.prototype.hasOwnProperty.call for safer property checking
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];

            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            } else if (typeof value === 'object') {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
    }

    return sanitized;
}

/**
 * Sanitize rich text content (for HR Updates)
 * Allows safe HTML tags only
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - Sanitized HTML
 */
function sanitizeRichText(html) {
    if (typeof html !== 'string') {
        return html;
    }

    let sanitized = html;

    // Remove dangerous tags
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'applet', 'link', 'style', 'meta'];
    dangerousTags.forEach(tag => {
        const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
        sanitized = sanitized.replace(regex, '');
        sanitized = sanitized.replace(new RegExp(`<${tag}[^>]*>`, 'gi'), '');
    });

    // Remove event handlers from all tags
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: and data: protocols
    sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
    sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, '');
    sanitized = sanitized.replace(/href\s*=\s*["']data:text\/html[^"']*["']/gi, '');

    return sanitized;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
function isValidEmail(email) {
    return validator.isEmail(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
function isValidURL(url) {
    return validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true
    });
}

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
function isValidPhone(phone) {
    // Allow numbers, +, -, (, ), spaces
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone);
}

/**
 * Check if string contains dangerous patterns
 * @param {string} input - Input to check
 * @returns {boolean} - True if dangerous
 */
function containsDangerousPatterns(input) {
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
 * Escape special characters for SQL (additional layer, though parameterized queries are primary defense)
 * @param {string} input - Input to escape
 * @returns {string} - Escaped string
 */
function escapeSQLChars(input) {
    if (typeof input !== 'string') {
        return input;
    }

    return input.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
        switch (char) {
            case '\0': return '\\0';
            case '\x08': return '\\b';
            case '\x09': return '\\t';
            case '\x1a': return '\\z';
            case '\n': return '\\n';
            case '\r': return '\\r';
            case '"':
            case "'":
            case '\\':
            case '%':
                return '\\' + char;
            default:
                return char;
        }
    });
}

module.exports = {
    sanitizeString,
    sanitizeObject,
    sanitizeRichText,
    isValidEmail,
    isValidURL,
    isValidPhone,
    containsDangerousPatterns,
    escapeSQLChars
};
