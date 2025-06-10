// Code Complete Review: 20240815120000
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string; // Explicitly add className
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, type = 'text', error, icon, className = '', ...props }, ref) => {
    const errorId = name && error ? `${name}-error` : undefined;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative rounded-md shadow-sm">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon} {/* Consider icon color for dark mode if it's text-based */}
            </div>
          )}
          <input
            ref={ref} // Assign the forwarded ref here
            id={name}
            name={name}
            type={type}
            className={`block w-full ${icon ? 'pl-10' : 'px-3'} py-2 border ${
              error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 dark:border-slate-600 focus:ring-primary focus:border-primary dark:focus:border-primary'
            } rounded-md sm:text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 ${className}`}
            aria-invalid={!!error}
            aria-describedby={errorId}
            {...props}
          />
        </div>
        {error && <p id={errorId} className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Good practice for debugging with forwardRef

export default Input;