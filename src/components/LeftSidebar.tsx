import React, { useState } from 'react';
import { useGraph } from '@/context/GraphContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { JobTypeBadge, LevelBadge } from '@/components/JobTypeBadge';
import { ICPBadge } from '@/components/ICPBadge';
import { 
  Plus, 
  Link2, 
  Upload, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Filter,
  X,
  Trash2,
  Sparkles
} from 'lucide-react';
import { JobType, ICP, ICP_OPTIONS } from '@/types/graph';

interface LeftSidebarProps {
  onCreateJob: () => void;
  onCreateEdge: () => void;
  onImportExport: () => void;
  onAnalyzeInterview: () => void;
  className?: string;
}

export function LeftSidebar({ onCreateJob, onCreateEdge, onImportExport, onAnalyzeInterview, className }: LeftSidebarProps) {
  const { state, setSelectedNode, setFilters, uniqueLevels, clearAll } = useGraph();
  const { filters } = state.viewState;
  
  const [jobsOpen, setJobsOpen] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [edgesOpen, setEdgesOpen] = useState(false);
  
  const jobTypes: JobType[] = ['functional', 'emotional', 'social'];
  
  const handleICPToggle = (icp: ICP) => {
    const newICPs = filters.icps.includes(icp)
      ? filters.icps.filter(i => i !== icp)
      : [...filters.icps, icp];
    setFilters({ icps: newICPs });
  };
  
  const handleTypeToggle = (type: JobType) => {
    const newTypes = filters.jobTypes.includes(type)
      ? filters.jobTypes.filter(t => t !== type)
      : [...filters.jobTypes, type];
    setFilters({ jobTypes: newTypes });
  };
  
  const handleLevelToggle = (level: number) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    setFilters({ levels: newLevels });
  };
  
  const clearFilters = () => {
    setFilters({ icps: [], jobTypes: [], levels: [], searchQuery: '' });
  };
  
  const hasActiveFilters = filters.icps.length > 0 || 
    filters.jobTypes.length > 0 || 
    filters.levels.length > 0 || 
    filters.searchQuery.trim() !== '';
  
  return (
    <div className={cn('flex flex-col h-full bg-sidebar border-r border-sidebar-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h2 className="font-semibold text-lg text-foreground mb-3">Jobs Graph</h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={onCreateJob}>
            <Plus className="w-4 h-4 mr-1.5" />
            Job
          </Button>
          <Button size="sm" variant="secondary" onClick={onCreateEdge}>
            <Link2 className="w-4 h-4 mr-1.5" />
            Edge
          </Button>
          <Button size="sm" variant="ghost" onClick={onImportExport}>
            <Upload className="w-4 h-4 mr-1.5" />
            Import/Export
          </Button>
          <Button size="sm" variant="outline" onClick={onAnalyzeInterview}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            Analyze
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              className="pl-9"
              value={filters.searchQuery}
              onChange={e => setFilters({ searchQuery: e.target.value })}
            />
          </div>
          
          {/* Filters */}
          <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </span>
              {filtersOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={clearFilters}>
                  <X className="w-3 h-3 mr-2" />
                  Clear all filters
                </Button>
              )}
              
              {/* Job Types */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Job Type</Label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map(type => (
                    <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        checked={filters.jobTypes.includes(type)}
                        onCheckedChange={() => handleTypeToggle(type)}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Levels */}
              {uniqueLevels.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueLevels.map(level => (
                      <label key={level} className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox
                          checked={filters.levels.includes(level)}
                          onCheckedChange={() => handleLevelToggle(level)}
                          className="w-3.5 h-3.5"
                        />
                        <span className="text-xs">L{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              
              {/* ICP Filter */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">ICP</Label>
                <div className="flex flex-wrap gap-2">
                  {ICP_OPTIONS.map(icp => (
                    <label key={icp.value} className="flex items-center gap-1.5 cursor-pointer">
                      <Checkbox
                        checked={filters.icps.includes(icp.value)}
                        onCheckedChange={() => handleICPToggle(icp.value)}
                        className="w-3.5 h-3.5"
                      />
                      <span className="text-xs">{icp.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          {/* Jobs List */}
          <Collapsible open={jobsOpen} onOpenChange={setJobsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <span>Jobs ({state.jobs.length})</span>
              {jobsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2">
              {state.jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No jobs yet. Create one to get started!
                </p>
              ) : (
                state.jobs.slice(0, 20).map(job => (
                  <button
                    key={job.id}
                    className={cn(
                      'w-full text-left p-2 rounded-md transition-colors text-sm',
                      'hover:bg-sidebar-accent',
                      state.viewState.selectedNodeId === job.id && 'bg-sidebar-accent'
                    )}
                    onClick={() => setSelectedNode(job.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <LevelBadge level={job.level} className="w-5 h-5 text-[10px]" />
                      <JobTypeBadge type={job.job_type} size="sm" />
                    </div>
                    <p className="truncate font-medium">{job.title}</p>
                    {job.icp && (
                      <div className="mt-1">
                        <ICPBadge icp={job.icp} size="sm" />
                      </div>
                    )}
                  </button>
                ))
              )}
              {state.jobs.length > 20 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{state.jobs.length - 20} more jobs
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
          
          <Separator />
          
          {/* Edges List */}
          <Collapsible open={edgesOpen} onOpenChange={setEdgesOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <span>Edges ({state.edges.length})</span>
              {edgesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 pt-2">
              {state.edges.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No edges yet
                </p>
              ) : (
                state.edges.slice(0, 10).map(edge => {
                  const source = state.jobs.find(j => j.id === edge.source_id);
                  const target = state.jobs.find(j => j.id === edge.target_id);
                  return (
                    <div key={edge.id} className="p-2 rounded-md bg-secondary/30 text-xs">
                      <span className="font-medium">{source?.title.slice(0, 20)}...</span>
                      <span className="text-muted-foreground mx-1">→</span>
                      <span className="font-medium">{target?.title.slice(0, 20)}...</span>
                    </div>
                  );
                })
              )}
              {state.edges.length > 10 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  +{state.edges.length - 10} more edges
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            if (confirm('Clear all data? This cannot be undone.')) {
              clearAll();
            }
          }}
          disabled={state.jobs.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
    </div>
  );
}
