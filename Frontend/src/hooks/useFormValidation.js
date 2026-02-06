import { useState, useCallback } from 'react';
import { validateInput, sanitizeString } from '../utils/validation';

/**
 * Custom hook for form validation
 * @param {object} initialValues - Initial form values
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} - Form state and handlers
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Handle input change
    const handleChange = useCallback((name, value) => {
        // Sanitize the value
        const sanitizedValue = typeof value === 'string' ? sanitizeString(value) : value;

        setValues(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));

        // Validate if field has been touched
        if (touched[name] && validationRules[name]) {
            const validation = validateInput(sanitizedValue, validationRules[name]);
            setErrors(prev => ({
                ...prev,
                [name]: validation.valid ? '' : validation.message
            }));
        }
    }, [touched, validationRules]);

    // Handle input blur
    const handleBlur = useCallback((name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate on blur
        if (validationRules[name]) {
            const validation = validateInput(values[name], validationRules[name]);
            setErrors(prev => ({
                ...prev,
                [name]: validation.valid ? '' : validation.message
            }));
        }
    }, [values, validationRules]);

    // Validate all fields
    const validateAll = useCallback(() => {
        const newErrors = {};
        let isValid = true;

        Object.keys(validationRules).forEach(field => {
            const validation = validateInput(values[field] || '', validationRules[field]);
            if (!validation.valid) {
                newErrors[field] = validation.message;
                isValid = false;
            }
        });

        setErrors(newErrors);
        setTouched(Object.keys(validationRules).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {}));

        return isValid;
    }, [values, validationRules]);

    // Reset form
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        reset,
        setValues
    };
}
