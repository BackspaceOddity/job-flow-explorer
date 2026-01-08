import React from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { X, ExternalLink, Edit2, Trash2, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobTypeBadge, LevelBadge } from '@/components/JobTypeBadge';
import { ICPBadge } from '@/components/ICPBadge';
import { QuickScoreEditor } from '@/components/QuickScoreEditor';
import { NodeMetricsDisplay, OpportunityMetricsDisplay } from '@/components/MetricDisplay';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { JOB_STAGE_CONFIG } from '@/lib/opportunityScoring';

interface NodeDetailsPanelProps {
  onEdit: (jobId: string) => void;
  className?: string;
}

export function NodeDetailsPanel({ onEdit, className }: NodeDetailsPanelProps) {
  const { state, setSelectedNode, setSubgraph, setActiveView, deleteJob, updateJob } = useGraph();
  const { selectedNodeId } = state.viewState;
  
  if (!selectedNodeId) {
    return (
      <div className={cn('flex flex-col items-center justify-center h-full text-center p-6', className)}>
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ExternalLink className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="font-medium text-foreground mb-1">No Node Selected</h3>
        <p className="text-sm text-muted-foreground">Click on a node in the graph to see details and metrics</p>
      </div>
    );
  }
  
  const job = state.jobs.find(j => j.id === selectedNodeId);
  const metrics = state.metrics?.nodes.get(selectedNodeId);
  
  if (!job) return null;
  
  // Find connected jobs
  const incomingEdges = state.edges.filter(e => e.target_id === selectedNodeId);
  const outgoingEdges = state.edges.filter(e => e.source_id === selectedNodeId);
  const incomingJobs = incomingEdges.map(e => state.jobs.find(j => j.id === e.source_id)).filter(Boolean);
  const outgoingJobs = outgoingEdges.map(e => state.jobs.find(j => j.id === e.target_id)).filter(Boolean);
  
  // Find main job if this is a sub-job
  const mainJob = job.main_job_id ? state.jobs.find(j => j.id === job.main_job_id) : null;
  
  const handleExploreSubgraph = () => {
    setActiveView('graph');
    setSubgraph({ enabled: true, centerId: selectedNodeId, hops: 2 });
  };
  
  const handleDelete = () => {
    if (confirm(`Delete "${job.title}"? This will also remove all connected edges.`)) {
      deleteJob(job.id);
    }
  };
  
  const handleImportanceChange = (value: number) => {
    updateJob(job.id, { importance: value });
  };
  
  const handleSatisfactionChange = (value: number) => {
    updateJob(job.id, { satisfaction: value });
  };
  
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <JobTypeBadge type={job.job_type} size="sm" />
              <LevelBadge level={job.level} />
              <ICPBadge icp={job.icp} size="sm" />
              {job.job_stage && (
                <Badge variant="outline" className="text-xs">
                  <Map className="w-3 h-3 mr-1" />
                  {JOB_STAGE_CONFIG[job.job_stage].label}
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-foreground leading-tight">{job.title}</h3>
            <p className="text-xs font-mono text-muted-foreground mt-1">{job.id}</p>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setSelectedNode(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Description */}
        {job.description && (
          <p className="text-sm text-muted-foreground">{job.description}</p>
        )}
        
        {/* Main Job Reference */}
        {mainJob && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Main Job:</span>
            <button
              className="text-sm font-medium text-primary hover:underline"
              onClick={() => setSelectedNode(mainJob.id)}
            >
              {mainJob.title}
            </button>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(job.id)}>
            <Edit2 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" className="flex-1" onClick={handleExploreSubgraph}>
            <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
            Explore
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <Separator />
        
        {/* Quick I×S Score Editor */}
        <div className="space-y-2 w-full max-w-full overflow-hidden">
          <h4 className="text-sm font-medium text-muted-foreground">Quick I×S Scoring</h4>
          <div className="w-full max-w-[calc(100%-8px)] pr-1">
            <QuickScoreEditor
              importance={job.importance}
              satisfaction={job.satisfaction}
              onImportanceChange={handleImportanceChange}
              onSatisfactionChange={handleSatisfactionChange}
              compact
            />
          </div>
        </div>
        
        <Separator />
        
        {/* Opportunity Metrics */}
        <OpportunityMetricsDisplay job={job} />
        
        <Separator />
        
        {/* Job Impact Analysis */}
        {metrics && <NodeMetricsDisplay metrics={metrics} job={job} />}
        
        <Separator />
        
        {/* Connections */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Connections</h4>
          
          {incomingJobs.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Incoming ({incomingJobs.length})</p>
              <div className="space-y-1">
                {incomingJobs.slice(0, 5).map(j => j && (
                  <button
                    key={j.id}
                    className="w-full text-left text-sm p-2 rounded bg-secondary/50 hover:bg-secondary transition-colors truncate"
                    onClick={() => setSelectedNode(j.id)}
                  >
                    {j.title}
                  </button>
                ))}
                {incomingJobs.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{incomingJobs.length - 5} more</p>
                )}
              </div>
            </div>
          )}
          
          {outgoingJobs.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Outgoing ({outgoingJobs.length})</p>
              <div className="space-y-1">
                {outgoingJobs.slice(0, 5).map(j => j && (
                  <button
                    key={j.id}
                    className="w-full text-left text-sm p-2 rounded bg-secondary/50 hover:bg-secondary transition-colors truncate"
                    onClick={() => setSelectedNode(j.id)}
                  >
                    {j.title}
                  </button>
                ))}
                {outgoingJobs.length > 5 && (
                  <p className="text-xs text-muted-foreground">+{outgoingJobs.length - 5} more</p>
                )}
              </div>
            </div>
          )}
          
          {incomingJobs.length === 0 && outgoingJobs.length === 0 && (
            <p className="text-sm text-muted-foreground">No connections yet</p>
          )}
        </div>
        
        {/* Notes */}
        {job.notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="text-sm text-foreground">{job.notes}</p>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
