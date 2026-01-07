import React from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { JobType, JobStage, ICP } from '@/types/graph';
import { JOB_STAGE_CONFIG, PHASES, computeOpportunityScore, isUnderserved } from '@/lib/opportunityScoring';
import { ICPBadge } from '@/components/ICPBadge';

import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { TrendingUp, AlertTriangle, Target, Zap, Heart, Users } from 'lucide-react';

interface JobMapViewProps {
  className?: string;
}

// Row categories for the JTBD Canvas
type RowCategory = 'steps' | 'outcomes' | 'barriers' | 'differentiators' | 'emotional' | 'social';

const ROW_CONFIG: Record<RowCategory, { label: string; icon: React.ReactNode; description: string }> = {
  steps: { label: 'Steps', icon: <Target className="w-4 h-4" />, description: 'Core functional jobs per stage (L1)' },
  outcomes: { label: 'Desired Outcomes', icon: <TrendingUp className="w-4 h-4" />, description: 'What they want to achieve' },
  barriers: { label: 'Barriers / Challenges', icon: <AlertTriangle className="w-4 h-4" />, description: 'Obstacles they face' },
  differentiators: { label: 'Job Differentiators', icon: <Zap className="w-4 h-4" />, description: 'Contextual variations (L2+)' },
  emotional: { label: 'Emotional Aspects', icon: <Heart className="w-4 h-4" />, description: 'How they want to feel' },
  social: { label: 'Social Aspects', icon: <Users className="w-4 h-4" />, description: 'How they want to be perceived' },
};

const ROW_ORDER: RowCategory[] = ['steps', 'outcomes', 'barriers', 'differentiators', 'emotional', 'social'];

const JOB_TYPE_COLORS: Record<JobType, string> = {
  functional: 'bg-[hsl(var(--job-functional))]',
  emotional: 'bg-[hsl(var(--job-emotional))]',
  social: 'bg-[hsl(var(--job-social))]',
};

export function JobMapView({ className }: JobMapViewProps) {
  const { state, setSelectedNode, setSelectedMainJob, filteredData } = useGraph();
  const { filters, selectedMainJobId } = state.viewState;
  
  // Filter jobs by selected ICP from sidebar
  const selectedICP: ICP | null = filters.icps.length === 1 ? filters.icps[0] : null;
  
  // Get L0 jobs for the Main Job dropdown (from all jobs, filtered by ICP if selected)
  const l0Jobs = state.jobs.filter(j => 
    j.level === 0 && (!selectedICP || j.icp === selectedICP)
  );
  
  // Use filteredData which respects all sidebar filters, then apply Main Job filter
  const baseJobs = filteredData.jobs;
  const filteredJobs = selectedMainJobId
    ? baseJobs.filter(j => j.main_job_id === selectedMainJobId || j.id === selectedMainJobId)
    : baseJobs;
  
  // Categorize jobs into rows
  const getJobsForCell = (category: RowCategory, stage: JobStage) => {
    const stageJobs = filteredJobs.filter(j => j.job_stage === stage);
    
    switch (category) {
      case 'steps':
        // L1 functional jobs only (L0 jobs have no stage)
        return stageJobs.filter(j => j.job_type === 'functional' && j.level === 1);
      case 'outcomes':
        // Jobs with outcome/goal keywords (NOT L0 since they have no stage)
        return stageJobs.filter(j => 
          j.job_type === 'functional' && 
          j.level > 0 &&
          (j.description?.toLowerCase().includes('outcome') || j.description?.toLowerCase().includes('goal'))
        );
      case 'barriers':
        // Jobs mentioning barriers, challenges, or risks (L1+)
        return stageJobs.filter(j => 
          j.level > 0 &&
          (j.notes?.toLowerCase().includes('barrier') ||
           j.notes?.toLowerCase().includes('challenge') ||
           j.notes?.toLowerCase().includes('risk') ||
           j.description?.toLowerCase().includes('avoid') ||
           j.description?.toLowerCase().includes('prevent'))
        );
      case 'differentiators':
        // L2+ functional jobs
        return stageJobs.filter(j => j.job_type === 'functional' && j.level > 1);
      case 'emotional':
        return stageJobs.filter(j => j.job_type === 'emotional' && j.level > 0);
      case 'social':
        return stageJobs.filter(j => j.job_type === 'social' && j.level > 0);
      default:
        return [];
    }
  };
  
  // Get jobs without stages for a summary
  const jobsWithoutStages = filteredJobs.filter(j => !j.job_stage);
  
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-foreground">JTBD Canvas</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Universal Job Map: 9 stages across 3 phases
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Main Job Selector */}
            <Select 
              value={selectedMainJobId || 'all'} 
              onValueChange={(val) => setSelectedMainJob(val === 'all' ? null : val)}
            >
              <SelectTrigger className="w-[280px] bg-background">
                <SelectValue placeholder="Select Main Job..." />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="all">All Main Jobs</SelectItem>
                {l0Jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title.length > 40 ? job.title.slice(0, 40) + '...' : job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedICP && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">ICP:</span>
                <ICPBadge icp={selectedICP} size="md" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 min-w-[1200px]">
          {/* Job Map Grid */}
          <div>
            <table className="w-full border-collapse">
              <thead>
                {/* Phase headers */}
                <tr>
                  <th className="w-40 min-w-[160px]" />
                  {PHASES.map(phase => (
                    <th
                      key={phase.id}
                      colSpan={phase.stages.length}
                      className={cn(
                        'text-center p-2 text-xs font-semibold border border-border',
                        phase.id === 'before' && 'bg-blue-500/10 text-blue-400',
                        phase.id === 'during' && 'bg-green-500/10 text-green-400',
                        phase.id === 'after' && 'bg-purple-500/10 text-purple-400'
                      )}
                    >
                      {phase.label}
                    </th>
                  ))}
                </tr>
                {/* Stage headers */}
                <tr>
                  <th className="w-40 min-w-[160px] p-2 text-xs text-muted-foreground border border-border text-left">
                    Category
                  </th>
                  {(Object.keys(JOB_STAGE_CONFIG) as JobStage[]).map(stage => (
                    <th
                      key={stage}
                      className="p-2 text-xs font-medium text-foreground border border-border min-w-[140px]"
                    >
                      {JOB_STAGE_CONFIG[stage].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROW_ORDER.map(category => (
                  <tr key={category}>
                    <td className="p-2 border border-border bg-secondary/20">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {ROW_CONFIG[category].icon}
                        </span>
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            {ROW_CONFIG[category].label}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {ROW_CONFIG[category].description}
                          </p>
                        </div>
                      </div>
                    </td>
                    {(Object.keys(JOB_STAGE_CONFIG) as JobStage[]).map(stage => {
                      const cellJobs = getJobsForCell(category, stage);
                      return (
                        <td
                          key={`${category}-${stage}`}
                          className="p-1.5 border border-border align-top min-h-[80px]"
                        >
                          <TooltipProvider>
                            <div className="space-y-1">
                              {cellJobs.map(job => {
                                const hasScores = job.importance !== null && job.satisfaction !== null;
                                const underserved = hasScores && isUnderserved(job.importance!, job.satisfaction!);
                                const score = hasScores ? computeOpportunityScore(job.importance!, job.satisfaction!) : null;
                                
                                return (
                                  <Tooltip key={job.id}>
                                    <TooltipTrigger asChild>
                                      <button
                                        className={cn(
                                          'w-full text-left p-2 rounded text-xs transition-all',
                                          'hover:ring-2 hover:ring-primary/50 hover:scale-[1.02]',
                                          state.viewState.selectedNodeId === job.id && 'ring-2 ring-primary',
                                          JOB_TYPE_COLORS[job.job_type],
                                          'text-white shadow-sm'
                                        )}
                                        onClick={() => setSelectedNode(job.id)}
                                      >
                                        <p className="font-medium line-clamp-2 leading-tight text-[11px]">{job.title}</p>
                                        <div className="flex items-center gap-1 mt-1 flex-wrap">
                                          {!selectedICP && (
                                            <span className="text-[9px] opacity-75 bg-black/20 px-1 rounded">
                                              {job.icp.replace('_', ' ').toUpperCase().slice(0, 3)}
                                            </span>
                                          )}
                                          {hasScores && (
                                            <span className="text-[9px] opacity-80 bg-black/20 px-1 rounded">
                                              I:{job.importance} S:{job.satisfaction}
                                            </span>
                                          )}
                                          {underserved && (
                                            <AlertTriangle className="w-3 h-3 text-white/90" />
                                          )}
                                          {score !== null && score >= 12 && (
                                            <span className="text-[9px] font-bold bg-white/20 px-1 rounded">
                                              {score}
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs bg-popover z-50">
                                      <p className="text-sm">{job.title}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                              {cellJobs.length === 0 && (
                                <div className="h-12 flex items-center justify-center text-muted-foreground/30 text-xs">
                                  —
                                </div>
                              )}
                            </div>
                          </TooltipProvider>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <span>{filteredJobs.filter(j => j.level > 0).length} sub-jobs {selectedICP ? `for ${selectedICP.replace('_', ' ')}` : 'total'}</span>
            <span>•</span>
            <span>{filteredJobs.filter(j => j.job_stage && j.level > 0).length} with stages assigned</span>
            {jobsWithoutStages.filter(j => j.level > 0).length > 0 && (
              <>
                <span>•</span>
                <span className="text-warning">{jobsWithoutStages.filter(j => j.level > 0).length} without stage</span>
              </>
            )}
          </div>
          
          {/* Jobs without stages (excluding L0) */}
          {jobsWithoutStages.filter(j => j.level > 0).length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border">
              <h3 className="text-xs font-medium text-muted-foreground mb-2">
                Jobs without stage assignment:
              </h3>
              <div className="flex flex-wrap gap-1">
                {jobsWithoutStages.filter(j => j.level > 0).slice(0, 10).map(job => (
                  <button
                    key={job.id}
                    className={cn(
                      'px-2 py-1 rounded text-[10px] transition-colors',
                      'bg-secondary hover:bg-secondary/80',
                      state.viewState.selectedNodeId === job.id && 'ring-1 ring-primary'
                    )}
                    onClick={() => setSelectedNode(job.id)}
                  >
                    {job.title.slice(0, 25)}...
                  </button>
                ))}
                {jobsWithoutStages.filter(j => j.level > 0).length > 10 && (
                  <span className="text-[10px] text-muted-foreground px-2 py-1">
                    +{jobsWithoutStages.filter(j => j.level > 0).length - 10} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
