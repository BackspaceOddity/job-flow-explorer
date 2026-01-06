import React, { useState, useRef } from 'react';
import { useGraph } from '@/context/GraphContext';
import { ImportData } from '@/types/graph';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileJson, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportExportDialog({ open, onOpenChange }: ImportExportDialogProps) {
  const { importData, exportData, state } = useGraph();
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ jobs: number; edges: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleValidate = () => {
    setError(null);
    setPreview(null);
    
    try {
      const data = JSON.parse(jsonInput) as ImportData;
      
      if (!data.jobs || !Array.isArray(data.jobs)) {
        throw new Error('Missing or invalid "jobs" array');
      }
      if (!data.edges || !Array.isArray(data.edges)) {
        throw new Error('Missing or invalid "edges" array');
      }
      
      // Validate jobs
      for (const job of data.jobs) {
        if (!job.id || typeof job.id !== 'string') {
          throw new Error(`Job missing required "id" field`);
        }
        if (!job.title || typeof job.title !== 'string') {
          throw new Error(`Job "${job.id}" missing required "title" field`);
        }
        if (typeof job.level !== 'number') {
          throw new Error(`Job "${job.id}" missing required "level" field (must be number)`);
        }
        if (!['functional', 'emotional', 'social', 'other'].includes(job.job_type)) {
          throw new Error(`Job "${job.id}" has invalid job_type`);
        }
      }
      
      // Validate edges
      const jobIds = new Set(data.jobs.map(j => j.id));
      for (const edge of data.edges) {
        if (!edge.source_id || !jobIds.has(edge.source_id)) {
          throw new Error(`Edge has invalid source_id: ${edge.source_id}`);
        }
        if (!edge.target_id || !jobIds.has(edge.target_id)) {
          throw new Error(`Edge has invalid target_id: ${edge.target_id}`);
        }
        if (!['depends_on', 'enables', 'precedes', 'influences'].includes(edge.relation_type)) {
          throw new Error(`Edge has invalid relation_type: ${edge.relation_type}`);
        }
      }
      
      setPreview({ jobs: data.jobs.length, edges: data.edges.length });
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      return null;
    }
  };
  
  const handleImport = () => {
    const data = handleValidate();
    if (data) {
      importData(data);
      toast.success(`Imported ${data.jobs.length} jobs and ${data.edges.length} edges`);
      onOpenChange(false);
      setJsonInput('');
      setPreview(null);
    }
  };
  
  const handleExport = () => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobs-graph-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Graph exported successfully');
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonInput(content);
      setError(null);
      setPreview(null);
    };
    reader.readAsText(file);
  };
  
  const sampleJson = JSON.stringify({
    jobs: [
      { id: "J1", title: "Main Decision", level: 0, parent_id: null, owner_role: "Owner", job_type: "functional" },
      { id: "J2", title: "Sub Task", level: 1, parent_id: "J1", owner_role: "Team", job_type: "functional" }
    ],
    edges: [
      { source_id: "J2", target_id: "J1", relation_type: "enables", weight: 1 }
    ]
  }, null, 2);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Import / Export Data</DialogTitle>
          <DialogDescription>
            Import graph data from JSON or export your current graph
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="import" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
            <TabsTrigger value="export">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex gap-2 mb-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                <FileJson className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setJsonInput(sampleJson)}>
                Load Sample
              </Button>
            </div>
            
            <Textarea
              className="flex-1 min-h-[200px] font-mono text-sm resize-none"
              placeholder="Paste your JSON here..."
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
                setPreview(null);
              }}
            />
            
            {error && (
              <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            {preview && (
              <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-success/10 text-success text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Valid! {preview.jobs} jobs, {preview.edges} edges ready to import
              </div>
            )}
            
            <DialogFooter className="mt-4">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button variant="secondary" onClick={handleValidate} disabled={!jsonInput.trim()}>
                Validate
              </Button>
              <Button onClick={handleImport} disabled={!preview}>
                Import Data
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="export" className="flex-1 flex flex-col mt-4">
            <div className="p-6 rounded-lg bg-secondary/50 text-center">
              <FileJson className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Export Current Graph</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {state.jobs.length} jobs, {state.edges.length} edges
              </p>
              <Button onClick={handleExport} disabled={state.jobs.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
