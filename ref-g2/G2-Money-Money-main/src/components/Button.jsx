// src/components/Button.jsx
import React from 'react';

/**
 * Shared button component matching reference module.
 * variant: 'primary' | 'green' | 'outline' | 'secondary'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    green: 'btn-green',
    outline: 'btn-outline',
    secondary: 'btn-secondary',
  }[variant] || 'btn-primary';

  const sizeClass = { sm: 'btn-sm', lg: 'btn-lg', md: '' }[size] || '';

  return (
    <button className={`btn ${variantClass} ${sizeClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
