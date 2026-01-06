import React from 'react';
import { cn } from '@/lib/utils';
import { NodeMetrics, Job } from '@/types/graph';
import { TrendingUp, GitBranch, RefreshCw, Activity, Target, Star, Gauge } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { computeOpportunityScore, isUnderserved, getQuadrant, QUADRANT_CONFIG } from '@/lib/opportunityScoring';

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

interface OpportunityMetricsDisplayProps {
  job: Job;
  className?: string;
}

export function OpportunityMetricsDisplay({ job, className }: OpportunityMetricsDisplayProps) {
  if (job.importance === null || job.satisfaction === null) {
    return (
      <div className={cn('text-sm text-muted-foreground', className)}>
        <p>No I×S scores set</p>
        <p className="text-xs mt-1">Edit this job to add Importance and Satisfaction ratings</p>
      </div>
    );
  }
  
  const score = computeOpportunityScore(job.importance, job.satisfaction);
  const underserved = isUnderserved(job.importance, job.satisfaction);
  const quadrant = getQuadrant(job.importance, job.satisfaction);
  const quadrantConfig = QUADRANT_CONFIG[quadrant];
  
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium text-muted-foreground">Opportunity Metrics</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <MetricDisplay
          label="Importance"
          value={job.importance}
          icon={<Star className="w-4 h-4" />}
          tooltip="Customer importance rating (1-10). How important is solving this job?"
          highlight={job.importance >= 7}
        />
        
        <MetricDisplay
          label="Satisfaction"
          value={job.satisfaction}
          icon={<Gauge className="w-4 h-4" />}
          tooltip="Customer satisfaction rating (1-10). How well is this job currently served?"
          highlight={job.satisfaction <= 3}
        />
        
        <MetricDisplay
          label="Opportunity Score"
          value={score}
          icon={<TrendingUp className="w-4 h-4" />}
          tooltip="ODI formula: Importance + max(Importance - Satisfaction, 0). Scale: 0-20."
          highlight={score >= 12}
          className="col-span-2"
        />
      </div>
      
      <div className={cn(
        'px-3 py-2 rounded-md',
        quadrantConfig.bgClass
      )}>
        <p className={cn('text-sm font-medium', quadrantConfig.textClass)}>
          {quadrantConfig.label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {quadrantConfig.description}
        </p>
      </div>
      
      {underserved && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-500/10 text-green-500">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">Underserved JTBD</span>
        </div>
      )}
    </div>
  );
}
