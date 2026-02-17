import * as React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({
  className = '',
  variant = 'text',
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200';

  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      aria-hidden="true"
    />
  );
}

export function NoteCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  );
}

export function FolderSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="h-5 w-5 rounded" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
