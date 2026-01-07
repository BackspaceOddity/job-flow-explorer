import React, { useState } from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { JobType, JobStage, ICP, Job } from '@/types/graph';
import { JOB_STAGE_CONFIG, PHASES, computeOpportunityScore, isUnderserved } from '@/lib/opportunityScoring';
import { ICPBadge } from '@/components/ICPBadge';
import { JobTypeBadge } from '@/components/JobTypeBadge';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TrendingUp, AlertTriangle, Target, Zap, Heart, Users, Grid3X3, List, ChevronDown, ChevronRight } from 'lucide-react';

type JobMapMode = 'canvas' | 'list';

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

// List View Component
function JobListView({ 
  jobs, 
  l0Jobs, 
  selectedNodeId, 
  onSelectJob 
}: { 
  jobs: Job[]; 
  l0Jobs: Job[];
  selectedNodeId: string | null;
  onSelectJob: (id: string) => void;
}) {
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set(l0Jobs.map(j => j.id)));
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const toggleExpanded = (id: string) => {
    setExpandedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  
  const toggleSort = () => {
    setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc');
  };
  
  // Group jobs by main_job_id
  const jobsByMainJob = new Map<string, Job[]>();
  const orphanJobs: Job[] = [];
  
  jobs.forEach(job => {
    if (job.level === 0) return; // L0 jobs are headers, not listed
    if (job.main_job_id) {
      const existing = jobsByMainJob.get(job.main_job_id) || [];
      existing.push(job);
      jobsByMainJob.set(job.main_job_id, existing);
    } else {
      orphanJobs.push(job);
    }
  });
  
  // Sort jobs within each group by opportunity score
  const getSortedJobs = (jobsList: Job[]) => {
    return [...jobsList].sort((a, b) => {
      const scoreA = (a.importance !== null && a.satisfaction !== null) 
        ? computeOpportunityScore(a.importance, a.satisfaction) 
        : -999;
      const scoreB = (b.importance !== null && b.satisfaction !== null) 
        ? computeOpportunityScore(b.importance, b.satisfaction) 
        : -999;
      return sortDirection === 'desc' ? scoreB - scoreA : scoreA - scoreB;
    });
  };
  
  return (
    <div className="space-y-2">
      {l0Jobs.map(mainJob => {
        const subJobs = getSortedJobs(jobsByMainJob.get(mainJob.id) || []);
        const isExpanded = expandedJobs.has(mainJob.id);
        
        return (
          <Collapsible key={mainJob.id} open={isExpanded} onOpenChange={() => toggleExpanded(mainJob.id)}>
            <CollapsibleTrigger asChild>
              <button 
                className={cn(
                  "w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors",
                  "bg-secondary/50 hover:bg-secondary/80",
                  selectedNodeId === mainJob.id && "ring-2 ring-primary"
                )}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{mainJob.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">L0</Badge>
                    <ICPBadge icp={mainJob.icp} size="sm" />
                    <span className="text-[10px] text-muted-foreground">{subJobs.length} sub-jobs</span>
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-6 mt-1 border-l-2 border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-[10px]">
                      <TableHead className="w-[40px] text-center">#</TableHead>
                      <TableHead className="w-[35%]">Job</TableHead>
                      <TableHead className="w-[60px]">Level</TableHead>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead className="w-[100px]">Stage</TableHead>
                      <TableHead className="w-[60px] text-center">I×S</TableHead>
                      <TableHead 
                        className="w-[60px] text-center cursor-pointer hover:text-foreground select-none"
                        onClick={toggleSort}
                      >
                        Opp {sortDirection === 'desc' ? '↓' : '↑'}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subJobs.map((job, index) => {
                      const hasScores = job.importance !== null && job.satisfaction !== null;
                      const score = hasScores ? computeOpportunityScore(job.importance!, job.satisfaction!) : null;
                      const underserved = hasScores && isUnderserved(job.importance!, job.satisfaction!);
                      
                      return (
                        <TableRow 
                          key={job.id}
                          className={cn(
                            "cursor-pointer hover:bg-secondary/50 text-xs",
                            selectedNodeId === job.id && "bg-primary/10"
                          )}
                          onClick={() => onSelectJob(job.id)}
                        >
                          <TableCell className="py-2 text-center">
                            <span className="font-mono text-muted-foreground text-[10px]">#{index + 1}</span>
                          </TableCell>
                          <TableCell className="py-2">
                            <p className="line-clamp-2">{job.title}</p>
                          </TableCell>
                          <TableCell className="py-2">
                            <Badge variant="outline" className="text-[10px]">L{job.level}</Badge>
                          </TableCell>
                          <TableCell className="py-2">
                            <JobTypeBadge type={job.job_type} size="sm" />
                          </TableCell>
                          <TableCell className="py-2 text-muted-foreground">
                            {job.job_stage ? JOB_STAGE_CONFIG[job.job_stage]?.label : '—'}
                          </TableCell>
                          <TableCell className="py-2 text-center">
                            {hasScores ? (
                              <span className="text-[10px]">{job.importance}×{job.satisfaction}</span>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="py-2 text-center">
                            {score !== null ? (
                              <span className={cn(
                                "text-[10px] font-medium px-1.5 py-0.5 rounded",
                                underserved && "bg-destructive/20 text-destructive"
                              )}>
                                {score.toFixed(1)}
                              </span>
                            ) : '—'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {subJobs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-4">
                          No sub-jobs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
      
      {orphanJobs.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-secondary/30 border border-border">
          <h3 className="text-xs font-medium text-muted-foreground mb-2">
            Jobs without Main Job assignment ({orphanJobs.length}):
          </h3>
          <Table>
            <TableBody>
              {orphanJobs.slice(0, 10).map(job => (
                <TableRow 
                  key={job.id}
                  className={cn(
                    "cursor-pointer hover:bg-secondary/50 text-xs",
                    selectedNodeId === job.id && "bg-primary/10"
                  )}
                  onClick={() => onSelectJob(job.id)}
                >
                  <TableCell className="py-2">{job.title}</TableCell>
                  <TableCell className="py-2 w-[60px]">
                    <Badge variant="outline" className="text-[10px]">L{job.level}</Badge>
                  </TableCell>
                  <TableCell className="py-2 w-[80px]">
                    <JobTypeBadge type={job.job_type} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function JobMapView({ className }: JobMapViewProps) {
  const { state, setSelectedNode, setSelectedMainJob, filteredData } = useGraph();
  const { filters, selectedMainJobId } = state.viewState;
  const [viewMode, setViewMode] = useState<JobMapMode>('canvas');
  
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
    <div className={cn('flex flex-col h-full overflow-hidden bg-background', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-foreground">JTBD Canvas</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {viewMode === 'canvas' ? 'Universal Job Map: 9 stages across 3 phases' : 'All jobs grouped by Main Job'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'canvas' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3 rounded-r-none"
                onClick={() => setViewMode('canvas')}
              >
                <Grid3X3 className="w-4 h-4 mr-1.5" />
                Canvas
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-3 rounded-l-none border-l border-border"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-1.5" />
                List
              </Button>
            </div>
            
            {/* Main Job Selector - only show in canvas mode */}
            {viewMode === 'canvas' && (
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
            )}
            
            {selectedICP && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">ICP:</span>
                <ICPBadge icp={selectedICP} size="md" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto min-h-0 max-h-full">
        {/* List View */}
        {viewMode === 'list' && (
          <div className="p-4 pb-8">
            <JobListView 
              jobs={filteredJobs} 
              l0Jobs={l0Jobs.filter(j => !selectedMainJobId || j.id === selectedMainJobId)}
              selectedNodeId={state.viewState.selectedNodeId}
              onSelectJob={setSelectedNode}
            />
          </div>
        )}
        
        {/* Canvas View */}
        {viewMode === 'canvas' && (
        <div className="p-4 min-w-[1200px] pb-8">
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
        )}
      </div>
    </div>
  );
}
