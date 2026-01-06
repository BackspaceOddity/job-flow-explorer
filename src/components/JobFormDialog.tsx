import React, { useState } from 'react';
import { useGraph } from '@/context/GraphContext';
import { Job, JobType, JobStage, ICP, ICP_OPTIONS } from '@/types/graph';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { isUnderserved, computeOpportunityScore, JOB_STAGE_CONFIG } from '@/lib/opportunityScoring';
import { TrendingUp, AlertTriangle } from 'lucide-react';

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
    icp: editingJob?.icp || 'ceo',
    job_type: editingJob?.job_type || 'functional',
    notes: editingJob?.notes || '',
    importance: editingJob?.importance ?? null,
    satisfaction: editingJob?.satisfaction ?? null,
    job_stage: editingJob?.job_stage ?? null,
    main_job_id: editingJob?.main_job_id ?? null,
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
          icp: editingJob.icp,
          job_type: editingJob.job_type,
          notes: editingJob.notes,
          importance: editingJob.importance,
          satisfaction: editingJob.satisfaction,
          job_stage: editingJob.job_stage,
          main_job_id: editingJob.main_job_id,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          level: 0,
          parent_id: null,
          icp: 'ceo',
          job_type: 'functional',
          notes: '',
          importance: null,
          satisfaction: null,
          job_stage: null,
          main_job_id: null,
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
  const mainJobOptions = state.jobs.filter(j => j.id !== editingJobId && (j.level === 0 || j.level === 1));
  
  const showUnderservedBadge = formData.importance !== null && formData.satisfaction !== null && 
    isUnderserved(formData.importance, formData.satisfaction);
  
  const opportunityScore = formData.importance !== null && formData.satisfaction !== null
    ? computeOpportunityScore(formData.importance, formData.satisfaction)
    : null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingJobId ? 'Edit Job' : 'Create New Job'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title * (Verb + Object + Contextual Clarifier)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Identify compliance requirements for target jurisdiction"
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
              <Label htmlFor="icp">ICP (Ideal Customer Profile)</Label>
              <Select
                value={formData.icp}
                onValueChange={(value: ICP) => setFormData(prev => ({ ...prev, icp: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICP_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          
          <Separator />
          
          {/* Importance & Satisfaction Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Underserved JTBD Scoring</Label>
              {showUnderservedBadge && (
                <Badge variant="default" className="bg-green-500 text-white">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Underserved
                </Badge>
              )}
              {opportunityScore !== null && (
                <Badge variant="secondary">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Score: {opportunityScore}
                </Badge>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Importance (1-10)</Label>
                  <span className="text-sm font-mono">
                    {formData.importance ?? '—'}
                  </span>
                </div>
                <Slider
                  value={formData.importance !== null ? [formData.importance] : [5]}
                  onValueChange={([v]) => setFormData(prev => ({ ...prev, importance: v }))}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Not important</span>
                  <span>Very important</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">Satisfaction (1-10)</Label>
                  <span className="text-sm font-mono">
                    {formData.satisfaction ?? '—'}
                  </span>
                </div>
                <Slider
                  value={formData.satisfaction !== null ? [formData.satisfaction] : [5]}
                  onValueChange={([v]) => setFormData(prev => ({ ...prev, satisfaction: v }))}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Not satisfied</span>
                  <span>Very satisfied</span>
                </div>
              </div>
              
              {formData.importance === null && formData.satisfaction === null && (
                <p className="text-xs text-muted-foreground">
                  Use sliders above to set I×S scores from customer interviews
                </p>
              )}
            </div>
          </div>
          
          <Separator />
          
          {/* Job Map Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Job Map Assignment</Label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job_stage" className="text-xs text-muted-foreground">Job Stage</Label>
                <Select
                  value={formData.job_stage || 'none'}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    job_stage: value === 'none' ? null : value as JobStage 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {Object.entries(JOB_STAGE_CONFIG).map(([stage, config]) => (
                      <SelectItem key={stage} value={stage}>
                        {config.label} ({config.phase})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="main_job_id" className="text-xs text-muted-foreground">Main Job</Label>
                <Select
                  value={formData.main_job_id || 'none'}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    main_job_id: value === 'none' ? null : value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select main job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (This is a main job)</SelectItem>
                    {mainJobOptions.map(job => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title.length > 25 ? job.title.slice(0, 25) + '...' : job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Separator />
          
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
