import React from 'react';
import { cn } from '@/lib/utils';
import { JobType } from '@/types/graph';

export const JOB_TYPE_COLORS: Record<JobType, { bg: string; text: string; border: string }> = {
  functional: { bg: 'bg-job-functional/20', text: 'text-job-functional', border: 'border-job-functional' },
  emotional: { bg: 'bg-job-emotional/20', text: 'text-job-emotional', border: 'border-job-emotional' },
  social: { bg: 'bg-job-social/20', text: 'text-job-social', border: 'border-job-social' },
};

export const JOB_TYPE_HEX: Record<JobType, string> = {
  functional: '#0ea5e9',
  emotional: '#ec4899',
  social: '#f59e0b',
};

interface JobTypeBadgeProps {
  type: JobType;
  size?: 'sm' | 'md';
  className?: string;
}

export function JobTypeBadge({ type, size = 'md', className }: JobTypeBadgeProps) {
  const colors = JOB_TYPE_COLORS[type];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium capitalize',
        colors.bg,
        colors.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        className
      )}
    >
      {type}
    </span>
  );
}

interface LevelBadgeProps {
  level: number;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-mono font-medium',
        'bg-secondary text-secondary-foreground',
        className
      )}
    >
      L{level}
    </span>
  );
}
