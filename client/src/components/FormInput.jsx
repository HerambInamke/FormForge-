import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-text-800">
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`block w-full rounded-md shadow-sm transition-colors duration-200 ${
          error
            ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-500 animate-fade-in">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default FormInput; 