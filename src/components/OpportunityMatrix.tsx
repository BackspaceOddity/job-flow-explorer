import React from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { computeOpportunityScore, getQuadrant, QUADRANT_CONFIG } from '@/lib/opportunityScoring';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
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
          
          {/* Job dots - Updated mapping */}
          {scoredJobs.map(job => {
            // X = Importance (1-10 → 0-100%), Y = Satisfaction (inverted: 10 at top, 1 at bottom)
            const x = ((job.importance! - 1) / 9) * 100;
            const y = 100 - ((job.satisfaction! - 1) / 9) * 100;
            const quadrant = getQuadrant(job.importance, job.satisfaction);
            const score = computeOpportunityScore(job.importance, job.satisfaction);
            const isSelected = state.viewState.selectedNodeId === job.id;
            
            return (
              <Tooltip key={job.id}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all',
                      'border-2 hover:scale-150 hover:z-10',
                      isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-150 z-10',
                      quadrant === 'opportunity' && 'bg-green-500 border-green-300',
                      quadrant === 'appropriately_served' && 'bg-yellow-500 border-yellow-300',
                      quadrant === 'over_served' && 'bg-red-500 border-red-300',
                      quadrant === 'dont_invest' && 'bg-muted-foreground border-muted'
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
        <div className="grid grid-cols-2 gap-2 text-xs">
          {Object.entries(QUADRANT_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', config.bgClass, config.textClass)} 
                style={{ backgroundColor: config.color }} />
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
