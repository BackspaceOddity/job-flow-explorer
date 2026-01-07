import React from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle } from 'lucide-react';
import { isUnderserved, computeOpportunityScore, getQuadrant, QUADRANT_CONFIG } from '@/lib/opportunityScoring';

interface QuickScoreEditorProps {
  importance: number | null;
  satisfaction: number | null;
  onImportanceChange: (value: number) => void;
  onSatisfactionChange: (value: number) => void;
  className?: string;
  compact?: boolean;
}

export function QuickScoreEditor({
  importance,
  satisfaction,
  onImportanceChange,
  onSatisfactionChange,
  className,
  compact = false,
}: QuickScoreEditorProps) {
  const showUnderserved = importance !== null && satisfaction !== null && 
    isUnderserved(importance, satisfaction);
  
  const opportunityScore = importance !== null && satisfaction !== null
    ? computeOpportunityScore(importance, satisfaction)
    : null;
    
  const quadrant = importance !== null && satisfaction !== null
    ? getQuadrant(importance, satisfaction)
    : null;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Status badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {showUnderserved && (
          <Badge variant="default" className="bg-green-500 text-white text-[10px]">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Underserved
          </Badge>
        )}
        {opportunityScore !== null && (
          <Badge variant="secondary" className="text-[10px]">
            <TrendingUp className="w-3 h-3 mr-1" />
            Score: {opportunityScore}
          </Badge>
        )}
        {quadrant && (
          <span className={cn('text-[10px] font-medium', QUADRANT_CONFIG[quadrant].textClass)}>
            {QUADRANT_CONFIG[quadrant].label}
          </span>
        )}
      </div>

      {/* Importance slider */}
      <div className="space-y-1 w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={cn('text-muted-foreground', compact ? 'text-[10px]' : 'text-xs')}>
            Importance
          </span>
          <span className={cn('font-mono font-medium shrink-0 min-w-[24px] text-right', compact ? 'text-xs' : 'text-sm')}>
            {importance ?? '—'}
          </span>
        </div>
        <div className="w-full pr-1">
          <Slider
            value={importance !== null ? [importance] : [5]}
            onValueChange={([v]) => onImportanceChange(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
        {!compact && (
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        )}
      </div>

      {/* Satisfaction slider */}
      <div className="space-y-1 w-full overflow-hidden">
        <div className="flex items-center justify-between">
          <span className={cn('text-muted-foreground', compact ? 'text-[10px]' : 'text-xs')}>
            Satisfaction
          </span>
          <span className={cn('font-mono font-medium shrink-0 min-w-[24px] text-right', compact ? 'text-xs' : 'text-sm')}>
            {satisfaction ?? '—'}
          </span>
        </div>
        <div className="w-full pr-1">
          <Slider
            value={satisfaction !== null ? [satisfaction] : [5]}
            onValueChange={([v]) => onSatisfactionChange(v)}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>
        {!compact && (
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        )}
      </div>
    </div>
  );
}
