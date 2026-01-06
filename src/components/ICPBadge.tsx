import React from 'react';
import { cn } from '@/lib/utils';
import { ICP } from '@/types/graph';

interface ICPBadgeProps {
  icp: ICP;
  size?: 'sm' | 'md';
  className?: string;
}

const ICP_CONFIG: Record<ICP, { label: string; className: string }> = {
  ceo: {
    label: 'CEO',
    className: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  },
  hr_manager: {
    label: 'HR Manager',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  head_of_finance: {
    label: 'Head of Finance',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  hiring_manager: {
    label: 'Hiring Manager',
    className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  head_of_legal: {
    label: 'Head of Legal',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function ICPBadge({ icp, size = 'md', className }: ICPBadgeProps) {
  const config = ICP_CONFIG[icp];
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function getICPLabel(icp: ICP): string {
  return ICP_CONFIG[icp]?.label || icp;
}
