import React, { useState } from 'react';
import { GraphProvider, useGraph } from '@/context/GraphContext';
import { LeftSidebar } from '@/components/LeftSidebar';
import { NodeDetailsPanel } from '@/components/NodeDetailsPanel';
import { GraphVisualization } from '@/components/GraphVisualization';
import { JobFormDialog } from '@/components/JobFormDialog';
import { EdgeFormDialog } from '@/components/EdgeFormDialog';
import { ImportExportDialog } from '@/components/ImportExportDialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RefreshCw, Route, Repeat, X, Sparkles, Target } from 'lucide-react';
import { sampleJobs, generateSampleEdges } from '@/data/sampleData';
import { toast } from 'sonner';

function GraphApp() {
  const { state, recomputeMetrics, toggleCriticalPath, toggleLoops, setSubgraph, addJob, addEdge } = useGraph();
  const { showCriticalPath, showLoops, subgraph } = state.viewState;
  
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [edgeDialogOpen, setEdgeDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const handleEditJob = (id: string) => {
    setEditingJobId(id);
    setJobDialogOpen(true);
  };

  const handleCloseJobDialog = (open: boolean) => {
    setJobDialogOpen(open);
    if (!open) setEditingJobId(null);
  };

  const loadSampleData = () => {
    const jobs = sampleJobs.map(j => addJob(j));
    const edges = generateSampleEdges(jobs);
    edges.forEach(e => addEdge(e));
    toast.success('Sample data loaded!');
  };

  const topTension = state.metrics?.topTensionNodes.slice(0, 5) || [];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <LeftSidebar
        className="w-72 shrink-0"
        onCreateJob={() => { setEditingJobId(null); setJobDialogOpen(true); }}
        onCreateEdge={() => setEdgeDialogOpen(true)}
        onImportExport={() => setImportDialogOpen(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-foreground">Jobs Graph Mapper</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {state.jobs.length} jobs · {state.edges.length} edges
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="critical" checked={showCriticalPath} onCheckedChange={toggleCriticalPath} />
              <Label htmlFor="critical" className="text-sm flex items-center gap-1">
                <Route className="w-3.5 h-3.5" /> Critical Path
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="loops" checked={showLoops} onCheckedChange={toggleLoops} />
              <Label htmlFor="loops" className="text-sm flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5" /> Cycles
              </Label>
            </div>
            <Button variant="secondary" size="sm" onClick={recomputeMetrics}>
              <RefreshCw className="w-4 h-4 mr-1.5" /> Recompute
            </Button>
            {state.jobs.length === 0 && (
              <Button size="sm" onClick={loadSampleData}>
                <Sparkles className="w-4 h-4 mr-1.5" /> Load Sample
              </Button>
            )}
          </div>
        </header>

        {/* Subgraph Banner */}
        {subgraph.enabled && (
          <div className="h-10 bg-primary/10 border-b border-primary/20 flex items-center justify-between px-4">
            <span className="text-sm text-primary">
              Viewing subgraph: {subgraph.hops} hops from selected node
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Hops:</span>
                <Slider
                  value={[subgraph.hops]}
                  onValueChange={([v]) => setSubgraph({ hops: v })}
                  min={1}
                  max={5}
                  step={1}
                  className="w-24"
                />
                <span className="text-xs font-mono w-4">{subgraph.hops}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSubgraph({ enabled: false, centerId: null })}>
                <X className="w-4 h-4 mr-1" /> Exit
              </Button>
            </div>
          </div>
        )}

        {/* Graph Canvas */}
        <div className="flex-1 relative">
          <GraphVisualization />
          
          {/* Top Tension Nodes Overlay */}
          {topTension.length > 0 && (
            <div className="absolute top-4 left-4 p-3 rounded-lg bg-card/90 backdrop-blur border border-border max-w-xs">
              <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Top Tension Points
              </h3>
              <div className="space-y-1">
                {topTension.map((id, i) => {
                  const job = state.jobs.find(j => j.id === id);
                  const score = state.metrics?.nodes.get(id)?.tensionScore || 0;
                  return job ? (
                    <div key={id} className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-muted-foreground">#{i + 1}</span>
                      <span className="truncate flex-1">{job.title}</span>
                      <span className="font-mono text-primary">{score.toFixed(1)}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 shrink-0 border-l border-border bg-card">
        <NodeDetailsPanel onEdit={handleEditJob} />
      </div>

      {/* Dialogs */}
      <JobFormDialog open={jobDialogOpen} onOpenChange={handleCloseJobDialog} editingJobId={editingJobId} />
      <EdgeFormDialog open={edgeDialogOpen} onOpenChange={setEdgeDialogOpen} />
      <ImportExportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </div>
  );
}

export default function Index() {
  return (
    <GraphProvider>
      <GraphApp />
    </GraphProvider>
  );
}
