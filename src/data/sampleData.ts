import { Job, Edge, JobType, RelationType, ICP, JobStage } from '@/types/graph';

// Main Job ID constant
const MAIN_JOB_ID = 'main-job-expand-workforce';

// Sample data for demonstration using Jim Kalbach's syntax: Verb + Object + Contextual Clarifier
export const sampleJobs: Omit<Job, 'id'>[] = [
  // Main JTBD
  {
    title: 'Expand workforce into new international market',
    description: 'Strategic initiative to hire employees in a new country for global expansion',
    level: 0,
    parent_id: null,
    icp: 'ceo',
    job_type: 'functional',
    notes: 'Core main job - all sub-jobs map to this',
    importance: 10,
    satisfaction: 2,
    job_stage: null,
    main_job_id: null,
  },
  // Phase 1: Before - Define
  {
    title: 'Define expansion goals for target market entry',
    description: 'Establish clear objectives and success criteria for international hiring',
    level: 1,
    parent_id: null,
    icp: 'ceo',
    job_type: 'functional',
    notes: '',
    importance: 9,
    satisfaction: 3,
    job_stage: 'define',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Identify compliance requirements for target jurisdiction',
    description: 'Research employment laws, regulations, and legal constraints',
    level: 1,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 9,
    satisfaction: 4,
    job_stage: 'define',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 1: Before - Locate
  {
    title: 'Locate qualified legal counsel in target jurisdiction',
    description: 'Find and vet local legal partners for employment law guidance',
    level: 1,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 4,
    job_stage: 'locate',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Assess talent availability in target region',
    description: 'Research local job market and candidate pool quality',
    level: 1,
    parent_id: null,
    icp: 'hiring_manager',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 5,
    job_stage: 'locate',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 1: Before - Prepare
  {
    title: 'Prepare compliance documentation for market entry',
    description: 'Draft required legal and regulatory filings',
    level: 2,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 7,
    satisfaction: 5,
    job_stage: 'prepare',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Calculate employment costs for offshore workforce',
    description: 'Estimate total cost including salary, benefits, taxes, and overhead',
    level: 1,
    parent_id: null,
    icp: 'head_of_finance',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 4,
    job_stage: 'prepare',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 1: Before - Confirm
  {
    title: 'Confirm budget allocation for international hiring',
    description: 'Secure financial approval and allocate resources',
    level: 1,
    parent_id: null,
    icp: 'head_of_finance',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 3,
    job_stage: 'confirm',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Select entity structure for market entry',
    description: 'Decide between EOR, subsidiary, or branch office',
    level: 1,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 9,
    satisfaction: 4,
    job_stage: 'confirm',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 2: During - Execute
  {
    title: 'Execute employee onboarding across time zones',
    description: 'Implement remote onboarding program for new international hires',
    level: 2,
    parent_id: null,
    icp: 'hr_manager',
    job_type: 'functional',
    notes: '',
    importance: 9,
    satisfaction: 2,
    job_stage: 'execute',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Screen candidates for cultural fit remotely',
    description: 'Evaluate candidates for alignment with company values and culture',
    level: 1,
    parent_id: null,
    icp: 'hiring_manager',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 3,
    job_stage: 'execute',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Create compliant employment agreements for local hires',
    description: 'Draft contracts meeting local labor law requirements',
    level: 2,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 8,
    satisfaction: 5,
    job_stage: 'execute',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 2: During - Monitor
  {
    title: 'Monitor payroll compliance in new jurisdiction',
    description: 'Track and ensure ongoing payroll tax and reporting compliance',
    level: 2,
    parent_id: null,
    icp: 'head_of_finance',
    job_type: 'functional',
    notes: '',
    importance: 7,
    satisfaction: 4,
    job_stage: 'monitor',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Avoid reputational risk in new market',
    description: 'Ensure company actions align with local expectations and norms',
    level: 1,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'emotional',
    notes: '',
    importance: 8,
    satisfaction: 5,
    job_stage: 'monitor',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 2: During - Modify
  {
    title: 'Modify employment contracts for local requirements',
    description: 'Adjust contracts based on regulatory changes or feedback',
    level: 2,
    parent_id: null,
    icp: 'head_of_legal',
    job_type: 'functional',
    notes: '',
    importance: 6,
    satisfaction: 6,
    job_stage: 'modify',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 3: After - Conclude
  {
    title: 'Conclude visa processing for new hires',
    description: 'Complete all immigration documentation and approvals',
    level: 2,
    parent_id: null,
    icp: 'hr_manager',
    job_type: 'functional',
    notes: '',
    importance: 5,
    satisfaction: 7,
    job_stage: 'conclude',
    main_job_id: MAIN_JOB_ID,
  },
  // Phase 3: After - Follow up
  {
    title: 'Follow up on employee integration progress',
    description: 'Track new hire satisfaction and team integration metrics',
    level: 1,
    parent_id: null,
    icp: 'hiring_manager',
    job_type: 'functional',
    notes: '',
    importance: 6,
    satisfaction: 5,
    job_stage: 'follow_up',
    main_job_id: MAIN_JOB_ID,
  },
  {
    title: 'Demonstrate company values to local hires',
    description: 'Reinforce culture and values through ongoing communication',
    level: 1,
    parent_id: null,
    icp: 'ceo',
    job_type: 'social',
    notes: '',
    importance: 6,
    satisfaction: 5,
    job_stage: 'follow_up',
    main_job_id: MAIN_JOB_ID,
  },
  // Emotional Jobs
  {
    title: 'Feel confident about regulatory compliance',
    description: 'Achieve peace of mind that all legal requirements are met',
    level: 1,
    parent_id: null,
    icp: 'ceo',
    job_type: 'emotional',
    notes: '',
    importance: 9,
    satisfaction: 2,
    job_stage: 'confirm',
    main_job_id: MAIN_JOB_ID,
  },
  // Social Jobs
  {
    title: 'Build trust with new international team',
    description: 'Establish strong working relationships across cultures',
    level: 1,
    parent_id: null,
    icp: 'hr_manager',
    job_type: 'social',
    notes: '',
    importance: 7,
    satisfaction: 4,
    job_stage: 'execute',
    main_job_id: MAIN_JOB_ID,
  },
];

export function generateSampleEdges(jobs: Job[]): Omit<Edge, 'id'>[] {
  const findJob = (title: string) => jobs.find(j => j.title.includes(title));
  
  const edges: Omit<Edge, 'id'>[] = [];
  
  const mainJob = findJob('Expand workforce');
  const defineGoals = findJob('Define expansion goals');
  const identifyCompliance = findJob('Identify compliance requirements');
  const locateCounsel = findJob('Locate qualified legal counsel');
  const assessTalent = findJob('Assess talent availability');
  const prepareCompliance = findJob('Prepare compliance documentation');
  const calculateCosts = findJob('Calculate employment costs');
  const confirmBudget = findJob('Confirm budget allocation');
  const selectEntity = findJob('Select entity structure');
  const executeOnboarding = findJob('Execute employee onboarding');
  const screenCandidates = findJob('Screen candidates');
  const createAgreements = findJob('Create compliant employment agreements');
  const feelConfident = findJob('Feel confident about regulatory');
  const buildTrust = findJob('Build trust with new international');
  
  // Define → Main Job
  if (defineGoals && mainJob) {
    edges.push({ source_id: defineGoals.id, target_id: mainJob.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Identify Compliance → Define Goals
  if (identifyCompliance && defineGoals) {
    edges.push({ source_id: identifyCompliance.id, target_id: defineGoals.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Identify Compliance → Locate Counsel
  if (identifyCompliance && locateCounsel) {
    edges.push({ source_id: identifyCompliance.id, target_id: locateCounsel.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  
  // Locate Counsel → Prepare Compliance
  if (locateCounsel && prepareCompliance) {
    edges.push({ source_id: locateCounsel.id, target_id: prepareCompliance.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Assess Talent → Screen Candidates
  if (assessTalent && screenCandidates) {
    edges.push({ source_id: assessTalent.id, target_id: screenCandidates.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  
  // Calculate Costs → Confirm Budget
  if (calculateCosts && confirmBudget) {
    edges.push({ source_id: calculateCosts.id, target_id: confirmBudget.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Select Entity → Calculate Costs
  if (selectEntity && calculateCosts) {
    edges.push({ source_id: selectEntity.id, target_id: calculateCosts.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Confirm Budget → Execute Onboarding
  if (confirmBudget && executeOnboarding) {
    edges.push({ source_id: confirmBudget.id, target_id: executeOnboarding.id, relation_type: 'precedes', weight: 1, notes: '' });
  }
  
  // Create Agreements → Execute Onboarding
  if (createAgreements && executeOnboarding) {
    edges.push({ source_id: createAgreements.id, target_id: executeOnboarding.id, relation_type: 'enables', weight: 1, notes: '' });
  }
  
  // Identify Compliance → Feel Confident
  if (identifyCompliance && feelConfident) {
    edges.push({ source_id: identifyCompliance.id, target_id: feelConfident.id, relation_type: 'influences', weight: 0.8, notes: '' });
  }
  
  // Execute Onboarding → Build Trust
  if (executeOnboarding && buildTrust) {
    edges.push({ source_id: executeOnboarding.id, target_id: buildTrust.id, relation_type: 'influences', weight: 0.7, notes: '' });
  }
  
  // Feel Confident → Main Job
  if (feelConfident && mainJob) {
    edges.push({ source_id: feelConfident.id, target_id: mainJob.id, relation_type: 'influences', weight: 0.8, notes: '' });
  }
  
  return edges;
}
