import React from 'react';

/**
 * Validated Input Component
 * Displays input with validation error messages
 */
export default function ValidatedInput({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    type = 'text',
    placeholder = '',
    required = false,
    maxLength,
    pattern,
    className = '',
    ...props
}) {
    const hasError = touched && error;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur && onBlur(name)}
                placeholder={placeholder}
                maxLength={maxLength}
                pattern={pattern}
                className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-itc-blue focus:border-transparent
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {hasError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {maxLength && (
                <p className="mt-1 text-xs text-gray-500 text-right">
                    {value?.length || 0} / {maxLength}
                </p>
            )}
        </div>
    );
}

/**
 * Validated Textarea Component
 */
export function ValidatedTextarea({
    label,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched,
    placeholder = '',
    required = false,
    maxLength,
    rows = 4,
    className = '',
    ...props
}) {
    const hasError = touched && error;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                name={name}
                value={value || ''}
                onChange={(e) => onChange(name, e.target.value)}
                onBlur={() => onBlur && onBlur(name)}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={rows}
                className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-itc-blue focus:border-transparent
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {hasError && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </p>
            )}
            {maxLength && (
                <p className="mt-1 text-xs text-gray-500 text-right">
                    {value?.length || 0} / {maxLength}
                </p>
            )}
        </div>
    );
}
