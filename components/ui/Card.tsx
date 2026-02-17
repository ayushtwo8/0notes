import * as React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  selected?: boolean;
}

export function Card({
  children,
  padding = 'md',
  hoverable = false,
  selected = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'bg-white rounded-xl shadow-sm border border-gray-100';

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const hoverStyles = hoverable
    ? 'cursor-pointer transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-md hover:scale-[1.01]'
    : '';

  const selectedStyles = selected
    ? 'ring-2 ring-[#E34664] ring-offset-2'
    : '';

  return (
    <div
      className={`${baseStyles} ${paddings[padding]} ${hoverStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
