import React, { useState } from 'react';
import { useGraph } from '@/context/GraphContext';
import { Edge, RelationType } from '@/types/graph';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface EdgeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEdgeId?: string | null;
}

export function EdgeFormDialog({ open, onOpenChange, editingEdgeId }: EdgeFormDialogProps) {
  const { state, addEdge, updateEdge } = useGraph();
  
  const editingEdge = editingEdgeId ? state.edges.find(e => e.id === editingEdgeId) : null;
  
  const [formData, setFormData] = useState<Omit<Edge, 'id'>>({
    source_id: editingEdge?.source_id || '',
    target_id: editingEdge?.target_id || '',
    relation_type: editingEdge?.relation_type || 'depends_on',
    weight: editingEdge?.weight ?? 1,
    notes: editingEdge?.notes || '',
  });
  
  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      if (editingEdge) {
        setFormData({
          source_id: editingEdge.source_id,
          target_id: editingEdge.target_id,
          relation_type: editingEdge.relation_type,
          weight: editingEdge.weight,
          notes: editingEdge.notes,
        });
      } else {
        setFormData({
          source_id: '',
          target_id: '',
          relation_type: 'depends_on',
          weight: 1,
          notes: '',
        });
      }
    }
  }, [open, editingEdge]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.source_id || !formData.target_id) return;
    if (formData.source_id === formData.target_id) return;
    
    if (editingEdgeId) {
      updateEdge(editingEdgeId, formData);
    } else {
      addEdge(formData);
    }
    
    onOpenChange(false);
  };
  
  const sourceJob = state.jobs.find(j => j.id === formData.source_id);
  const targetJob = state.jobs.find(j => j.id === formData.target_id);
  
  const relationLabels: Record<RelationType, string> = {
    depends_on: 'depends on',
    enables: 'enables',
    precedes: 'precedes',
    influences: 'influences',
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingEdgeId ? 'Edit Edge' : 'Create New Edge'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source_id">Source Job *</Label>
            <Select
              value={formData.source_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, source_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select source job" />
              </SelectTrigger>
              <SelectContent>
                {state.jobs.map(job => (
                  <SelectItem key={job.id} value={job.id} disabled={job.id === formData.target_id}>
                    {job.title.length > 40 ? job.title.slice(0, 40) + '...' : job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="relation_type">Relation Type</Label>
            <Select
              value={formData.relation_type}
              onValueChange={(value: RelationType) => setFormData(prev => ({ ...prev, relation_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="depends_on">Depends On</SelectItem>
                <SelectItem value="enables">Enables</SelectItem>
                <SelectItem value="precedes">Precedes</SelectItem>
                <SelectItem value="influences">Influences</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target_id">Target Job *</Label>
            <Select
              value={formData.target_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, target_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target job" />
              </SelectTrigger>
              <SelectContent>
                {state.jobs.map(job => (
                  <SelectItem key={job.id} value={job.id} disabled={job.id === formData.source_id}>
                    {job.title.length > 40 ? job.title.slice(0, 40) + '...' : job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Preview */}
          {sourceJob && targetJob && (
            <div className="p-3 rounded-lg bg-secondary/50 text-sm">
              <span className="font-medium">{sourceJob.title}</span>
              <span className="text-muted-foreground mx-2">{relationLabels[formData.relation_type]}</span>
              <span className="font-medium">{targetJob.title}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (1-10)</Label>
            <Input
              id="weight"
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={formData.weight}
              onChange={e => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 1 }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this relationship..."
              rows={2}
            />
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.source_id || !formData.target_id || formData.source_id === formData.target_id}
            >
              {editingEdgeId ? 'Save Changes' : 'Create Edge'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
