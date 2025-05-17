import React from 'react';

const Card = ({
  children,
  className = '',
  hover = false,
  animate = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-form ${
        hover ? 'hover:shadow-form-hover transition-shadow duration-200' : ''
      } ${animate ? 'animate-slide-up' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 