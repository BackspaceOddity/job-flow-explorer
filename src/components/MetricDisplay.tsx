import React from 'react';
import { cn } from '@/lib/utils';
import { NodeMetrics } from '@/types/graph';
import { TrendingUp, GitBranch, RefreshCw, Activity, Target } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MetricDisplayProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tooltip?: string;
  highlight?: boolean;
  className?: string;
}

export function MetricDisplay({ label, value, icon, tooltip, highlight, className }: MetricDisplayProps) {
  const content = (
    <div className={cn(
      'flex items-center gap-2 p-2 rounded-md transition-colors',
      highlight ? 'bg-primary/10' : 'bg-secondary/50',
      className
    )}>
      {icon && <span className={cn('text-muted-foreground', highlight && 'text-primary')}>{icon}</span>}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={cn('text-sm font-mono font-medium', highlight && 'text-primary')}>{value}</p>
      </div>
    </div>
  );
  
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return content;
}

interface NodeMetricsDisplayProps {
  metrics: NodeMetrics;
  className?: string;
}

export function NodeMetricsDisplay({ metrics, className }: NodeMetricsDisplayProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Graph Metrics</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <MetricDisplay
          label="Tension Score"
          value={metrics.tensionScore.toFixed(1)}
          icon={<Target className="w-4 h-4" />}
          tooltip="Composite score (0-100) indicating structural importance. Higher = more critical bottleneck."
          highlight={metrics.tensionScore > 30}
        />
        
        <MetricDisplay
          label="Betweenness"
          value={metrics.betweennessCentrality.toFixed(3)}
          icon={<GitBranch className="w-4 h-4" />}
          tooltip="How often this node lies on shortest paths between other nodes. High = major bottleneck."
          highlight={metrics.betweennessCentrality > 0.1}
        />
        
        <MetricDisplay
          label="PageRank"
          value={metrics.pageRank.toFixed(3)}
          icon={<TrendingUp className="w-4 h-4" />}
          tooltip="Influence score based on incoming connections and their importance."
          highlight={metrics.pageRank > 0.15}
        />
        
        <MetricDisplay
          label="Closeness"
          value={metrics.closenessCentrality.toFixed(3)}
          icon={<Activity className="w-4 h-4" />}
          tooltip="How quickly this node can reach all other nodes. High = well-connected."
        />
        
        <MetricDisplay
          label="In-Degree"
          value={metrics.inDegree}
          tooltip="Number of incoming edges (dependencies on this job)."
        />
        
        <MetricDisplay
          label="Out-Degree"
          value={metrics.outDegree}
          tooltip="Number of outgoing edges (jobs this one depends on)."
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {metrics.isInCycle && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning">
            <RefreshCw className="w-3 h-3" />
            In Cycle
          </span>
        )}
        {metrics.isOnCriticalPath && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
            <Target className="w-3 h-3" />
            Critical Path
          </span>
        )}
      </div>
    </div>
  );
}
