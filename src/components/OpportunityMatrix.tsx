import React from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { computeOpportunityScore, getQuadrant, QUADRANT_CONFIG } from '@/lib/opportunityScoring';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { JobType } from '@/types/graph';

// Deterministic hash for consistent jitter per job
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

// Job type colors for matrix dots
const JOB_TYPE_DOT_COLORS: Record<JobType, { bg: string; border: string }> = {
  functional: { bg: 'bg-[hsl(199,89%,48%)]', border: 'border-[hsl(199,89%,58%)]' },
  emotional: { bg: 'bg-[hsl(340,82%,52%)]', border: 'border-[hsl(340,82%,62%)]' },
  social: { bg: 'bg-[hsl(38,92%,50%)]', border: 'border-[hsl(38,92%,60%)]' },
};

interface OpportunityMatrixProps {
  className?: string;
  onJobSelect?: (jobId: string) => void;
}

export function OpportunityMatrix({ className, onJobSelect }: OpportunityMatrixProps) {
  const { state, setSelectedNode } = useGraph();
  
  // Filter jobs that have both importance and satisfaction
  const scoredJobs = state.jobs.filter(
    job => job.importance !== null && job.satisfaction !== null
  );
  
  const handleJobClick = (jobId: string) => {
    setSelectedNode(jobId);
    onJobSelect?.(jobId);
  };
  
  // Grid is 10x10, with (0,0) at bottom-left
  // X-axis: Importance (1-10, left to right)
  // Y-axis: Satisfaction (1-10, bottom to top)
  
  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Opportunity Matrix</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {scoredJobs.length} jobs with I×S scores
        </p>
      </div>
      
      {/* Matrix */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="relative w-full aspect-square max-w-[800px] mx-auto">
          {/* Background quadrants - Updated for new axes */}
          {/* X = Importance (left low, right high), Y = Satisfaction (bottom low, top high) */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Top-left: Low I, High S = Over-served */}
            <div className={cn('border-r border-b border-border/50', QUADRANT_CONFIG.over_served.bgClass)} />
            {/* Top-right: High I, High S = Appropriately Served */}
            <div className={cn('border-b border-border/50', QUADRANT_CONFIG.appropriately_served.bgClass)} />
            {/* Bottom-left: Low I, Low S = Don't Invest */}
            <div className={cn('border-r border-border/50', QUADRANT_CONFIG.dont_invest.bgClass)} />
            {/* Bottom-right: High I, Low S = Opportunity Zone */}
            <div className={QUADRANT_CONFIG.opportunity.bgClass} />
          </div>
          
          {/* Axis labels */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            Importance →
          </div>
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-muted-foreground">
            Satisfaction →
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[...Array(9)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-border/30"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
            {[...Array(9)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-border/30"
                style={{ top: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>
          
          {/* Threshold lines (at 5.5) */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border" />
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border" />
          
          {/* Job dots - Updated mapping with natural jitter */}
          {scoredJobs.map(job => {
            // Add deterministic jitter based on job ID for natural scatter
            const jitterX = ((hashCode(job.id) % 100) - 50) / 100 * 5; // ±5% jitter
            const jitterY = ((hashCode(job.id + 'y') % 100) - 50) / 100 * 5;
            
            // X = Importance (1-10 → 0-100%), Y = Satisfaction (inverted: 10 at top, 1 at bottom)
            const baseX = ((job.importance! - 1) / 9) * 100;
            const baseY = 100 - ((job.satisfaction! - 1) / 9) * 100;
            const x = Math.max(2, Math.min(98, baseX + jitterX));
            const y = Math.max(2, Math.min(98, baseY + jitterY));
            
            const quadrant = getQuadrant(job.importance, job.satisfaction);
            const score = computeOpportunityScore(job.importance, job.satisfaction);
            const isSelected = state.viewState.selectedNodeId === job.id;
            
            // Dynamic dot size based on total count
            const dotSize = scoredJobs.length > 100 ? 'w-3 h-3' : 'w-4 h-4';
            
            const typeColors = JOB_TYPE_DOT_COLORS[job.job_type];
            
            return (
              <Tooltip key={job.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all',
                      dotSize,
                      'border-2 hover:scale-150 hover:z-10',
                      typeColors.bg,
                      typeColors.border,
                      isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-background scale-150 z-10'
                    )}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onClick={() => handleJobClick(job.id)}
                  />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    I: {job.importance} · S: {job.satisfaction} · Score: {score}
                  </p>
                  <p className={cn('text-xs mt-1', QUADRANT_CONFIG[quadrant].textClass)}>
                    {QUADRANT_CONFIG[quadrant].label}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
          
          {/* Corner labels - Updated for new quadrant positions */}
          <div className="absolute top-2 left-2 text-[10px] text-red-500 font-medium">
            Over-served
          </div>
          <div className="absolute top-2 right-2 text-[10px] text-yellow-500 font-medium">
            Served
          </div>
          <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground font-medium">
            Don't Invest
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] text-green-500 font-medium">
            Opportunity
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(199,89%,48%)]" />
            <span className="text-muted-foreground">Functional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(340,82%,52%)]" />
            <span className="text-muted-foreground">Emotional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[hsl(38,92%,50%)]" />
            <span className="text-muted-foreground">Social</span>
          </div>
        </div>
      </div>
    </div>
  );
}
