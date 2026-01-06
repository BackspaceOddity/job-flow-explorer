import React, { useState } from 'react';
import { useGraph } from '@/context/GraphContext';
import { Job, JobType } from '@/types/graph';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingJobId?: string | null;
}

export function JobFormDialog({ open, onOpenChange, editingJobId }: JobFormDialogProps) {
  const { state, addJob, updateJob } = useGraph();
  
  const editingJob = editingJobId ? state.jobs.find(j => j.id === editingJobId) : null;
  
  const [formData, setFormData] = useState<Omit<Job, 'id'>>({
    title: editingJob?.title || '',
    description: editingJob?.description || '',
    level: editingJob?.level ?? 0,
    parent_id: editingJob?.parent_id || null,
    owner_role: editingJob?.owner_role || '',
    job_type: editingJob?.job_type || 'functional',
    notes: editingJob?.notes || '',
  });
  
  // Reset form when dialog opens with different job
  React.useEffect(() => {
    if (open) {
      if (editingJob) {
        setFormData({
          title: editingJob.title,
          description: editingJob.description,
          level: editingJob.level,
          parent_id: editingJob.parent_id,
          owner_role: editingJob.owner_role,
          job_type: editingJob.job_type,
          notes: editingJob.notes,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          level: 0,
          parent_id: null,
          owner_role: '',
          job_type: 'functional',
          notes: '',
        });
      }
    }
  }, [open, editingJob]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) return;
    
    if (editingJobId) {
      updateJob(editingJobId, formData);
    } else {
      addJob(formData);
    }
    
    onOpenChange(false);
  };
  
  const parentOptions = state.jobs.filter(j => j.id !== editingJobId);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingJobId ? 'Edit Job' : 'Create New Job'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Gather legal constraints"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this job..."
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_type">Job Type</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value: JobType) => setFormData(prev => ({ ...prev, job_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="emotional">Emotional</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Select
                value={String(formData.level)}
                onValueChange={(value) => setFormData(prev => ({ ...prev, level: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Level 0 (Top)</SelectItem>
                  <SelectItem value="1">Level 1</SelectItem>
                  <SelectItem value="2">Level 2</SelectItem>
                  <SelectItem value="3">Level 3</SelectItem>
                  <SelectItem value="4">Level 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner_role">Owner Role</Label>
              <Input
                id="owner_role"
                value={formData.owner_role}
                onChange={e => setFormData(prev => ({ ...prev, owner_role: e.target.value }))}
                placeholder="e.g., HR, Finance, Founder"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="parent_id">Parent Job</Label>
              <Select
                value={formData.parent_id || 'none'}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value === 'none' ? null : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {parentOptions.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title.length > 30 ? job.title.slice(0, 30) + '...' : job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes..."
              rows={2}
            />
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              {editingJobId ? 'Save Changes' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
