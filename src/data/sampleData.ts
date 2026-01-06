import { Job, Edge, JobType, RelationType } from '@/types/graph';

// Sample data for demonstration
export const sampleJobs: Omit<Job, 'id'>[] = [
  {
    title: 'Decide whether we can hire in a new country',
    description: 'Top-level decision job for international expansion',
    level: 0,
    parent_id: null,
    owner_role: 'Founder',
    job_type: 'functional',
    notes: 'Strategic decision with multiple dependencies',
  },
  {
    title: 'Gather legal constraints',
    description: 'Research employment laws and regulations',
    level: 1,
    parent_id: null,
    owner_role: 'HR',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Assess tax implications',
    description: 'Understand corporate and payroll tax requirements',
    level: 1,
    parent_id: null,
    owner_role: 'Finance',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Evaluate hiring costs',
    description: 'Calculate total cost of employment',
    level: 1,
    parent_id: null,
    owner_role: 'Finance',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Research local talent market',
    description: 'Understand availability of skills',
    level: 1,
    parent_id: null,
    owner_role: 'Recruiting',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Feel confident about compliance',
    description: 'Emotional need for risk mitigation',
    level: 1,
    parent_id: null,
    owner_role: 'Founder',
    job_type: 'emotional',
    notes: '',
  },
  {
    title: 'Align with local culture',
    description: 'Social consideration for team integration',
    level: 1,
    parent_id: null,
    owner_role: 'People Ops',
    job_type: 'social',
    notes: '',
  },
  {
    title: 'Set up payroll infrastructure',
    description: 'Establish payment processing',
    level: 2,
    parent_id: null,
    owner_role: 'Finance',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Choose EOR vs subsidiary',
    description: 'Decide on legal entity structure',
    level: 1,
    parent_id: null,
    owner_role: 'Legal',
    job_type: 'functional',
    notes: '',
  },
  {
    title: 'Draft employment contracts',
    description: 'Create legally compliant contracts',
    level: 2,
    parent_id: null,
    owner_role: 'Legal',
    job_type: 'functional',
    notes: '',
  },
];

export function generateSampleEdges(jobs: Job[]): Omit<Edge, 'id'>[] {
  const findJob = (title: string) => jobs.find(j => j.title.includes(title));
  
  const edges: Omit<Edge, 'id'>[] = [];
  
  const mainDecision = findJob('Decide whether');
  const legalConstraints = findJob('legal constraints');
  const taxImplications = findJob('tax implications');
  const hiringCosts = findJob('hiring costs');
  const talentMarket = findJob('talent market');
  const confidence = findJob('confident');
  const culture = findJob('culture');
  const payroll = findJob('payroll');
  const eorVsSub = findJob('EOR vs');
  const contracts = findJob('contracts');
  
  if (legalConstraints && mainDecision) {
    edges.push({ source_id: legalConstraints.id, target_id: mainDecision.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  if (taxImplications && mainDecision) {
    edges.push({ source_id: taxImplications.id, target_id: mainDecision.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  if (hiringCosts && mainDecision) {
    edges.push({ source_id: hiringCosts.id, target_id: mainDecision.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  if (talentMarket && mainDecision) {
    edges.push({ source_id: talentMarket.id, target_id: mainDecision.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  if (legalConstraints && confidence) {
    edges.push({ source_id: legalConstraints.id, target_id: confidence.id, relation_type: 'influences', weight: 1, notes: '' });
  }
  if (confidence && mainDecision) {
    edges.push({ source_id: confidence.id, target_id: mainDecision.id, relation_type: 'influences', weight: 0.8, notes: '' });
  }
  if (culture && talentMarket) {
    edges.push({ source_id: culture.id, target_id: talentMarket.id, relation_type: 'influences', weight: 0.7, notes: '' });
  }
  if (legalConstraints && eorVsSub) {
    edges.push({ source_id: legalConstraints.id, target_id: eorVsSub.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  if (eorVsSub && contracts) {
    edges.push({ source_id: eorVsSub.id, target_id: contracts.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  if (taxImplications && payroll) {
    edges.push({ source_id: taxImplications.id, target_id: payroll.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  if (contracts && payroll) {
    edges.push({ source_id: contracts.id, target_id: payroll.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  if (eorVsSub && hiringCosts) {
    edges.push({ source_id: eorVsSub.id, target_id: hiringCosts.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  return edges;
}
