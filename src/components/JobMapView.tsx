import React from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { JobType, JobStage } from '@/types/graph';
import { JOB_STAGE_CONFIG, PHASES } from '@/lib/opportunityScoring';
import { JobTypeBadge } from '@/components/JobTypeBadge';
import { ICPBadge } from '@/components/ICPBadge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { computeOpportunityScore, isUnderserved } from '@/lib/opportunityScoring';

interface JobMapViewProps {
  className?: string;
}

const JOB_TYPE_ROWS: JobType[] = ['functional', 'emotional', 'social', 'other'];

const JOB_TYPE_COLORS: Record<JobType, string> = {
  functional: 'bg-[hsl(var(--job-functional))]',
  emotional: 'bg-[hsl(var(--job-emotional))]',
  social: 'bg-[hsl(var(--job-social))]',
  other: 'bg-[hsl(var(--job-other))]',
};

export function JobMapView({ className }: JobMapViewProps) {
  const { state, setSelectedNode, setSelectedMainJob } = useGraph();
  const { selectedMainJobId } = state.viewState;
  
  // Get main jobs (level 0 or jobs without main_job_id that could be main jobs)
  const mainJobs = state.jobs.filter(j => j.level === 0 || (!j.main_job_id && j.level <= 1));
  
  // Get jobs for the selected main job
  const mappedJobs = selectedMainJobId
    ? state.jobs.filter(j => j.main_job_id === selectedMainJobId || j.id === selectedMainJobId)
    : [];
  
  // Organize jobs by stage and type
  const getJobsForCell = (stage: JobStage, jobType: JobType) => {
    return mappedJobs.filter(j => j.job_stage === stage && j.job_type === jobType);
  };
  
  const selectedMainJob = state.jobs.find(j => j.id === selectedMainJobId);
  
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Job Map Canvas</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Universal Job Map: 9 stages across 3 phases
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Main Job:</span>
          <Select
            value={selectedMainJobId || 'none'}
            onValueChange={(value) => setSelectedMainJob(value === 'none' ? null : value)}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a main job to map" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Select a job...</SelectItem>
              {mainJobs.map(job => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title.length > 40 ? job.title.slice(0, 40) + '...' : job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!selectedMainJobId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="font-medium text-foreground mb-2">Select a Main Job</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Choose a main job from the dropdown above to see its job map.
              Jobs need to have a "Job Stage" assigned in their details to appear on the map.
            </p>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4">
            {/* Main Job Header */}
            {selectedMainJob && (
              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <JobTypeBadge type={selectedMainJob.job_type} size="sm" />
                  <ICPBadge icp={selectedMainJob.icp} size="sm" />
                  {selectedMainJob.importance !== null && selectedMainJob.satisfaction !== null && (
                    <Badge variant={isUnderserved(selectedMainJob.importance, selectedMainJob.satisfaction) ? 'default' : 'secondary'}>
                      Score: {computeOpportunityScore(selectedMainJob.importance, selectedMainJob.satisfaction)}
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{selectedMainJob.title}</h3>
                {selectedMainJob.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedMainJob.description}</p>
                )}
              </div>
            )}
            
            {/* Job Map Grid */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[900px]">
                <thead>
                  {/* Phase headers */}
                  <tr>
                    <th className="w-24" />
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
                    <th className="w-24 p-2 text-xs text-muted-foreground border border-border">Type</th>
                    {Object.entries(JOB_STAGE_CONFIG).map(([stage, config]) => (
                      <th
                        key={stage}
                        className="p-2 text-xs font-medium text-foreground border border-border min-w-[100px]"
                      >
                        {config.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {JOB_TYPE_ROWS.map(jobType => (
                    <tr key={jobType}>
                      <td className="p-2 border border-border">
                        <JobTypeBadge type={jobType} size="sm" />
                      </td>
                      {(Object.keys(JOB_STAGE_CONFIG) as JobStage[]).map(stage => {
                        const cellJobs = getJobsForCell(stage, jobType);
                        return (
                          <td
                            key={`${jobType}-${stage}`}
                            className="p-2 border border-border align-top min-h-[80px]"
                          >
                            <div className="space-y-1">
                              {cellJobs.map(job => (
                                <button
                                  key={job.id}
                                  className={cn(
                                    'w-full text-left p-2 rounded text-xs transition-all',
                                    'hover:ring-2 hover:ring-primary/50',
                                    state.viewState.selectedNodeId === job.id && 'ring-2 ring-primary',
                                    JOB_TYPE_COLORS[job.job_type],
                                    'text-white'
                                  )}
                                  onClick={() => setSelectedNode(job.id)}
                                >
                                  <p className="font-medium truncate">{job.title}</p>
                                  {job.importance !== null && job.satisfaction !== null && (
                                    <p className="text-[10px] opacity-80 mt-0.5">
                                      I:{job.importance} S:{job.satisfaction}
                                    </p>
                                  )}
                                </button>
                              ))}
                              {cellJobs.length === 0 && (
                                <div className="h-16 flex items-center justify-center text-muted-foreground/30 text-xs">
                                  —
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>{mappedJobs.length} jobs mapped</span>
              <span>•</span>
              <span>{mappedJobs.filter(j => j.job_stage).length} with stages assigned</span>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
