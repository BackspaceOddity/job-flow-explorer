// Opportunity scoring calculations for Outcome-Driven Innovation (ODI)

import type { Job, OpportunityScore } from '@/types/graph';

/**
 * Calculate the ODI opportunity score
 * Formula: importance + max(importance - satisfaction, 0)
 * Scale: 0-20 where 20 is maximum opportunity
 */
export function computeOpportunityScore(importance: number | null, satisfaction: number | null): number {
  if (importance === null || satisfaction === null) return 0;
  return importance + Math.max(importance - satisfaction, 0);
}

/**
 * Determine if a job is underserved based on ODI criteria
 * Underserved: importance >= 5 AND satisfaction <= 5
 */
export function isUnderserved(importance: number | null, satisfaction: number | null): boolean {
  if (importance === null || satisfaction === null) return false;
  return importance >= 5 && satisfaction <= 5;
}

/**
 * Determine which quadrant a job falls into on the I x S matrix
 */
export function getQuadrant(importance: number | null, satisfaction: number | null): OpportunityScore['quadrant'] {
  if (importance === null || satisfaction === null) return 'dont_invest';
  
  const highImportance = importance >= 5;
  const lowSatisfaction = satisfaction <= 5;
  
  if (highImportance && lowSatisfaction) return 'opportunity';
  if (highImportance && !lowSatisfaction) return 'appropriately_served';
  if (!highImportance && !lowSatisfaction) return 'over_served';
  return 'dont_invest';
}

/**
 * Get full opportunity score data for a job
 */
export function getOpportunityData(job: Job): OpportunityScore | null {
  if (job.importance === null || job.satisfaction === null) return null;
  
  return {
    importance: job.importance,
    satisfaction: job.satisfaction,
    opportunityScore: computeOpportunityScore(job.importance, job.satisfaction),
    isUnderserved: isUnderserved(job.importance, job.satisfaction),
    quadrant: getQuadrant(job.importance, job.satisfaction),
  };
}

/**
 * Get top underserved jobs sorted by opportunity score
 */
export function getTopUnderservedJobs(jobs: Job[], limit: number = 10): string[] {
  return jobs
    .filter(job => job.importance !== null && job.satisfaction !== null)
    .map(job => ({
      id: job.id,
      score: computeOpportunityScore(job.importance, job.satisfaction),
      isUnderserved: isUnderserved(job.importance, job.satisfaction),
    }))
    .filter(item => item.isUnderserved)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.id);
}

/**
 * Quadrant display names and colors
 */
export const QUADRANT_CONFIG = {
  opportunity: {
    label: 'Opportunity Zone',
    description: 'High importance, low satisfaction - prioritize these',
    color: 'hsl(142, 76%, 36%)', // success green
    bgClass: 'bg-green-500/20',
    textClass: 'text-green-500',
  },
  appropriately_served: {
    label: 'Appropriately Served',
    description: 'High importance, high satisfaction - maintain',
    color: 'hsl(38, 92%, 50%)', // warning yellow
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-500',
  },
  over_served: {
    label: 'Over-served',
    description: 'Low importance, high satisfaction - deprioritize',
    color: 'hsl(0, 72%, 51%)', // destructive red
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-500',
  },
  dont_invest: {
    label: "Don't Invest",
    description: 'Low importance, low satisfaction - ignore',
    color: 'hsl(215, 16%, 55%)', // muted gray
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground',
  },
} as const;

/**
 * Job stage configuration for job map
 */
export const JOB_STAGE_CONFIG = {
  // Phase 1: Before
  define: { label: 'Define', phase: 'before', order: 0 },
  locate: { label: 'Locate', phase: 'before', order: 1 },
  prepare: { label: 'Prepare', phase: 'before', order: 2 },
  confirm: { label: 'Confirm', phase: 'before', order: 3 },
  // Phase 2: During
  execute: { label: 'Execute', phase: 'during', order: 4 },
  monitor: { label: 'Monitor', phase: 'during', order: 5 },
  modify: { label: 'Modify', phase: 'during', order: 6 },
  // Phase 3: After
  conclude: { label: 'Conclude', phase: 'after', order: 7 },
  follow_up: { label: 'Follow up', phase: 'after', order: 8 },
} as const;

export const PHASES = [
  { id: 'before', label: 'Phase 1: Before', stages: ['define', 'locate', 'prepare', 'confirm'] },
  { id: 'during', label: 'Phase 2: During', stages: ['execute', 'monitor', 'modify'] },
  { id: 'after', label: 'Phase 3: After', stages: ['conclude', 'follow_up'] },
] as const;
