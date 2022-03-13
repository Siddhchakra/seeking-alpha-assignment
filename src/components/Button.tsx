import React from 'react';
import classNames from 'classnames';

interface ButtonProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
  onClick?: () => any;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'default', className, onClick }) => {
  return (
    <button
      className={classNames('py-2 px-4 text-white font-semibold rounded-lg shadow-md', className, {
        'bg-blue-500': variant === 'default',
        'bg-green-500': variant === 'success',
        'bg-red-500': variant === 'error',
        'bg-orange-500': variant === 'warning'
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
