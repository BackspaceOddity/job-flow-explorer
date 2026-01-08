import React from 'react';
import { cn } from '@/lib/utils';
import { NodeMetrics, Job } from '@/types/graph';
import { TrendingUp, GitBranch, RefreshCw, Activity, Target, Star, Gauge, Zap, Clock, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { computeOpportunityScore, isUnderserved, getQuadrant, QUADRANT_CONFIG } from '@/lib/opportunityScoring';

// Business interpretations for graph metrics in JTBD context
export const BUSINESS_INSIGHTS = {
  tensionScore: {
    label: "Strategic Priority",
    lowDescription: "Lower priority for immediate innovation focus",
    highDescription: "Critical bottleneck — prioritize for innovation investment",
    threshold: 30,
    action: "Focus R&D resources on high-tension jobs first"
  },
  betweenness: {
    label: "Workflow Chokepoint",
    lowDescription: "Peripheral job with limited cascade impact",
    highDescription: "Major handoff point — failure here affects many jobs",
    threshold: 0.1,
    action: "Prime candidate for automation or process improvement"
  },
  pageRank: {
    label: "Inherited Importance",
    lowDescription: "Standalone job with limited network influence",
    highDescription: "Core dependency — many important jobs rely on this",
    threshold: 0.15,
    action: "Solving this elevates the entire customer experience"
  },
  closeness: {
    label: "Integration Hub",
    lowDescription: "Isolated from main job network",
    highDescription: "Well-connected to entire job ecosystem",
    threshold: 0.3,
    action: "Good candidate for platform-level solutions"
  },
  inDegree: {
    label: "Downstream Impact",
    lowDescription: "Few jobs depend on this completing",
    highDescription: "Many jobs blocked until this is done well",
    threshold: 3,
    action: "Requires high reliability — consider error-proofing"
  },
  outDegree: {
    label: "Complexity Level",
    lowDescription: "Self-contained job with few prerequisites",
    highDescription: "Complex job requiring many prerequisites",
    threshold: 3,
    action: "Consider simplification or bundling"
  }
} as const;

interface MetricDisplayProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  tooltip?: string;
  highlight?: boolean;
  className?: string;
  businessLabel?: string;
  businessInsight?: string;
}

export function MetricDisplay({ label, value, icon, tooltip, highlight, className, businessLabel, businessInsight }: MetricDisplayProps) {
  const content = (
    <div className={cn(
      'flex flex-col gap-1 p-2.5 rounded-md transition-colors',
      highlight ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/50',
      className
    )}>
      <div className="flex items-center gap-2">
        {icon && <span className={cn('text-muted-foreground', highlight && 'text-primary')}>{icon}</span>}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{businessLabel || label}</p>
          <p className={cn('text-sm font-mono font-medium', highlight && 'text-primary')}>{value}</p>
        </div>
      </div>
      {businessInsight && (
        <p className={cn(
          'text-xs leading-relaxed',
          highlight ? 'text-primary/80' : 'text-muted-foreground'
        )}>
          {businessInsight}
        </p>
      )}
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
  job?: Job;
  className?: string;
}

export function NodeMetricsDisplay({ metrics, job, className }: NodeMetricsDisplayProps) {
  const getInsight = (key: keyof typeof BUSINESS_INSIGHTS, value: number) => {
    const config = BUSINESS_INSIGHTS[key];
    return value >= config.threshold ? config.highDescription : config.lowDescription;
  };

  const jobIsUnderserved = job ? isUnderserved(job.importance, job.satisfaction) : false;
  const isPrimeTarget = metrics.tensionScore > 30 && jobIsUnderserved;

  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        Job Impact Analysis
      </h4>
      
      {isPrimeTarget && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-green-500/10 border border-green-500/20">
          <Target className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-500">Prime Innovation Target</p>
            <p className="text-xs text-green-500/80 mt-0.5">
              High structural impact + underserved by current solutions. Prioritize investment here.
            </p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        <MetricDisplay
          label="Tension Score"
          businessLabel={BUSINESS_INSIGHTS.tensionScore.label}
          value={metrics.tensionScore.toFixed(1)}
          icon={<Target className="w-4 h-4" />}
          tooltip={BUSINESS_INSIGHTS.tensionScore.action}
          highlight={metrics.tensionScore > 30}
          businessInsight={getInsight('tensionScore', metrics.tensionScore)}
        />
        
        <MetricDisplay
          label="Betweenness"
          businessLabel={BUSINESS_INSIGHTS.betweenness.label}
          value={metrics.betweennessCentrality.toFixed(3)}
          icon={<GitBranch className="w-4 h-4" />}
          tooltip={BUSINESS_INSIGHTS.betweenness.action}
          highlight={metrics.betweennessCentrality > 0.1}
          businessInsight={getInsight('betweenness', metrics.betweennessCentrality)}
        />
        
        <MetricDisplay
          label="PageRank"
          businessLabel={BUSINESS_INSIGHTS.pageRank.label}
          value={metrics.pageRank.toFixed(3)}
          icon={<TrendingUp className="w-4 h-4" />}
          tooltip={BUSINESS_INSIGHTS.pageRank.action}
          highlight={metrics.pageRank > 0.15}
          businessInsight={getInsight('pageRank', metrics.pageRank)}
        />
        
        <MetricDisplay
          label="Closeness"
          businessLabel={BUSINESS_INSIGHTS.closeness.label}
          value={metrics.closenessCentrality.toFixed(3)}
          icon={<Activity className="w-4 h-4" />}
          tooltip={BUSINESS_INSIGHTS.closeness.action}
          highlight={metrics.closenessCentrality > 0.3}
          businessInsight={getInsight('closeness', metrics.closenessCentrality)}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <MetricDisplay
          label="In-Degree"
          businessLabel={BUSINESS_INSIGHTS.inDegree.label}
          value={metrics.inDegree}
          tooltip={BUSINESS_INSIGHTS.inDegree.action}
          highlight={metrics.inDegree >= 3}
          businessInsight={getInsight('inDegree', metrics.inDegree)}
        />
        
        <MetricDisplay
          label="Out-Degree"
          businessLabel={BUSINESS_INSIGHTS.outDegree.label}
          value={metrics.outDegree}
          tooltip={BUSINESS_INSIGHTS.outDegree.action}
          highlight={metrics.outDegree >= 3}
          businessInsight={getInsight('outDegree', metrics.outDegree)}
        />
      </div>
      
      {(metrics.isInCycle || metrics.isOnCriticalPath) && (
        <div className="flex flex-wrap gap-2 mt-3">
          {metrics.isOnCriticalPath && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
                  <Clock className="w-3.5 h-3.5" />
                  Time-Critical
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm font-medium">On the longest dependency chain</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Any delay here delays everything downstream. Top priority for reducing cycle time.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {metrics.isInCycle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Iteration Loop
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <p className="text-sm font-medium">Part of a circular workflow</p>
                <p className="text-xs text-muted-foreground mt-1">
                  E.g., review-revise cycles. Focus on reducing iteration count or parallelizing work.
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
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
