import { Job, Edge, JobType, RelationType, ICP, JobStage } from '@/types/graph';

// Main Job titles for reference resolution
export const MAIN_JOB_TITLES = {
  EXPAND_WORKFORCE: 'Expand workforce into new international market',
  ENSURE_COMPLIANCE: 'Ensure compliance with labor laws across jurisdictions',
  BUILD_COMPENSATION: 'Build competitive compensation packages globally',
  ONBOARD_EMPLOYEES: 'Onboard distributed employees effectively',
  MANAGE_PAYROLL: 'Manage payroll across multiple currencies',
  ESTABLISH_ENTITY: 'Establish entity structure for international operations',
  NAVIGATE_VISAS: 'Navigate visa and work permit processes',
  CREATE_CULTURE: 'Create unified company culture across locations',
  MONITOR_PERFORMANCE: 'Monitor employee performance remotely',
  HANDLE_TERMINATIONS: 'Handle cross-border terminations legally',
};

// Helper to create sub-jobs with proper structure
const step = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 8, satisfaction = 4): Omit<Job, 'id'> => ({
  title,
  description: '',
  level: 1,
  parent_id: null,
  icp,
  job_type: 'functional',
  notes: '',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

const outcome = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 9, satisfaction = 4): Omit<Job, 'id'> => ({
  title,
  description: 'Desired outcome',
  level: 1,
  parent_id: null,
  icp,
  job_type: 'functional',
  notes: '',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

const barrier = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 7, satisfaction = 3): Omit<Job, 'id'> => ({
  title,
  description: '',
  level: 1,
  parent_id: null,
  icp,
  job_type: 'functional',
  notes: 'barrier',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

const emotional = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 8, satisfaction = 4): Omit<Job, 'id'> => ({
  title,
  description: '',
  level: 1,
  parent_id: null,
  icp,
  job_type: 'emotional',
  notes: '',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

const social = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 7, satisfaction = 5): Omit<Job, 'id'> => ({
  title,
  description: '',
  level: 1,
  parent_id: null,
  icp,
  job_type: 'social',
  notes: '',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

const differentiator = (title: string, stage: JobStage, icp: ICP, mainJob: string, importance = 6, satisfaction = 4): Omit<Job, 'id'> => ({
  title,
  description: 'differentiator',
  level: 2,
  parent_id: null,
  icp,
  job_type: 'functional',
  notes: '',
  importance,
  satisfaction,
  job_stage: stage,
  main_job_id: '__MAIN:' + mainJob,
});

export const sampleJobs: Omit<Job, 'id'>[] = [
  // ========== L0 MAIN JOBS (10 total) - No job_stage ==========
  { title: MAIN_JOB_TITLES.EXPAND_WORKFORCE, description: 'Strategic initiative to hire employees in a new country', level: 0, parent_id: null, icp: 'ceo', job_type: 'functional', notes: '', importance: 10, satisfaction: 2, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.ENSURE_COMPLIANCE, description: 'Maintain adherence to employment regulations', level: 0, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 10, satisfaction: 3, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.BUILD_COMPENSATION, description: 'Design fair pay structures across markets', level: 0, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 9, satisfaction: 4, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, description: 'Integrate new hires regardless of location', level: 0, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 9, satisfaction: 3, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.MANAGE_PAYROLL, description: 'Process accurate payments in local currencies', level: 0, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 9, satisfaction: 4, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.ESTABLISH_ENTITY, description: 'Set up legal presence in target countries', level: 0, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 8, satisfaction: 3, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.NAVIGATE_VISAS, description: 'Secure work authorization for employees', level: 0, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 2, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.CREATE_CULTURE, description: 'Build cohesive team identity across boundaries', level: 0, parent_id: null, icp: 'ceo', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.MONITOR_PERFORMANCE, description: 'Track distributed employee productivity', level: 0, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 3, job_stage: null, main_job_id: null },
  { title: MAIN_JOB_TITLES.HANDLE_TERMINATIONS, description: 'Execute compliant offboarding globally', level: 0, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 7, satisfaction: 2, job_stage: null, main_job_id: null },

  // ========== EXPAND WORKFORCE - Sub-jobs ==========
  step('Define expansion goals for target market', 'define', 'ceo', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 3),
  step('Identify compliance requirements for jurisdiction', 'define', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 4),
  step('Locate qualified legal counsel locally', 'locate', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 4),
  step('Assess talent availability in target region', 'locate', 'hiring_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 5),
  step('Calculate employment costs for offshore workforce', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 4),
  step('Confirm budget allocation for international hiring', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 3),
  step('Select entity structure for market entry', 'confirm', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 4),
  step('Screen candidates for cultural fit remotely', 'execute', 'hiring_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 3),
  step('Follow up on employee integration progress', 'follow_up', 'hiring_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 6, 5),
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize time to establish legal presence in target market', 'confirm', 'ceo', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 10, 3),
  outcome('Minimize time to first international hire', 'execute', 'hiring_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 4),
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Limited visibility into local regulatory requirements', 'prepare', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 2),
  barrier('Lack of access to qualified talent pools in region', 'locate', 'hiring_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 7, 3),
  emotional('Feel confident about regulatory compliance', 'confirm', 'ceo', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 2),
  emotional('Avoid reputational risk in new market', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 8, 5),
  social('Build trust with new international team', 'execute', 'hr_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 7, 4),
  social('Be recognized as desirable employer locally', 'monitor', 'hr_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 6, 4),
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When in high-risk jurisdiction: Additional due diligence required', 'prepare', 'head_of_legal', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 7, 5),
  differentiator('When hiring across time zones: Async onboarding protocols needed', 'execute', 'hr_manager', MAIN_JOB_TITLES.EXPAND_WORKFORCE, 9, 2),

  // ========== ENSURE COMPLIANCE - Sub-jobs ==========
  step('Define regulatory monitoring scope per country', 'define', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 9, 4),
  step('Locate reliable legal update sources', 'locate', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 7, 5),
  step('Confirm internal compliance controls are adequate', 'confirm', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 8, 4),
  step('Execute quarterly compliance audits', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 8, 4),
  step('Monitor regulatory changes in real-time', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 8, 3),
  step('Modify policies when regulations change', 'modify', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 7, 4),
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize likelihood of compliance violations', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 10, 4),
  outcome('Maximize first-time pass rate on regulatory audits', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 9, 5),
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Inability to keep pace with rapid regulatory changes', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 9, 2),
  barrier('Unclear or ambiguous legal requirements across jurisdictions', 'define', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 8, 3),
  emotional('Feel assured about legal exposure', 'monitor', 'ceo', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 9, 3),
  emotional('Feel in control of compliance risk', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 8, 4),
  social('Be seen as a compliant employer', 'follow_up', 'ceo', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 7, 5),
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When regulations change: Pre-built checklist templates speed updates', 'prepare', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 7, 6),
  differentiator('When monitoring at scale: Automated compliance tracking required', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ENSURE_COMPLIANCE, 6, 3),

  // ========== BUILD COMPENSATION - Sub-jobs ==========
  step('Define compensation philosophy for global workforce', 'define', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 5),
  { title: 'Locate salary benchmarking data per market', description: 'Source reliable compensation surveys for each country', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  { title: 'Confirm benefits packages meet local expectations', description: 'Validate that benefits are competitive in each market', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  { title: 'Execute annual compensation reviews globally', description: 'Perform coordinated salary reviews across all locations', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  { title: 'Monitor market rate changes continuously', description: 'Track salary trends in each operating market', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 4, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  
  // DIFFERENTIATORS
  { title: 'Prepare salary bands for each role by location', description: 'Create location-adjusted pay scales', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  { title: 'Design equity compensation for global employees', description: 'Create stock option plans that work internationally', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 6, satisfaction: 3, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize candidate acceptance rate through competitive offers', 'execute', 'hiring_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 9, 4),
  outcome('Minimize pay equity gaps across regions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Tension between cost constraints and market competitiveness', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 3),
  barrier('Lack of clarity on pay transparency requirements by country', 'execute', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 4),
  
  // EMOTIONAL
  { title: 'Feel confident about talent retention', description: 'Trust that compensation will keep top performers', level: 1, parent_id: null, icp: 'ceo', job_type: 'emotional', notes: '', importance: 8, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  { title: 'Feel fair about compensation decisions', description: 'Confidence that pay is equitable across regions', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'emotional', notes: '', importance: 7, satisfaction: 5, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },
  
  // SOCIAL
  { title: 'Be known for fair pay practices', description: 'Build reputation for equitable compensation', level: 1, parent_id: null, icp: 'ceo', job_type: 'social', notes: '', importance: 6, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.BUILD_COMPENSATION },

  // ========== L1/L2 JOBS FOR: Onboard distributed employees ==========
  // STEPS
  { title: 'Define onboarding standards for remote employees', description: 'Establish consistent onboarding experience regardless of location', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Locate local onboarding partners where needed', description: 'Find vendors for equipment, workspace, and local support', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Confirm IT equipment delivery before start date', description: 'Ensure new hires have everything they need on day one', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 3, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Execute virtual orientation sessions across time zones', description: 'Deliver engaging welcome sessions that work globally', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 3, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Monitor new hire ramp-up progress', description: 'Track productivity milestones for new employees', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Follow up on 30/60/90 day check-ins', description: 'Ensure new hires are supported through initial period', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  
  // DIFFERENTIATORS
  { title: 'Prepare onboarding materials in local languages', description: 'Translate key documents and training materials', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Create buddy program for remote hires', description: 'Pair new hires with experienced colleagues', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize time to full productivity for new hires', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 9, 4),
  outcome('Minimize early turnover rate for remote employees', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Difficulty coordinating across multiple time zones', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 3),
  barrier('Unreliable equipment delivery to remote locations', 'confirm', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 3),
  
  // EMOTIONAL
  { title: 'Feel welcomed despite physical distance', description: 'New hires feel part of the team from day one', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'emotional', notes: '', importance: 8, satisfaction: 3, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Feel prepared for the role', description: 'New hires understand expectations and have resources', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'emotional', notes: '', importance: 7, satisfaction: 4, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  
  // SOCIAL
  { title: 'Be recognized as part of the team', description: 'Remote employees feel included in team activities', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'social', notes: '', importance: 7, satisfaction: 4, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },
  { title: 'Connect with colleagues across locations', description: 'Build relationships with distributed team', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'social', notes: '', importance: 6, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ONBOARD_EMPLOYEES },

  // ========== L1/L2 JOBS FOR: Manage payroll across multiple currencies ==========
  // STEPS
  { title: 'Define payroll processing timelines per country', description: 'Establish pay dates accounting for local banking holidays', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Locate reliable payroll providers per region', description: 'Vet and select local payroll processing partners', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Confirm tax withholding calculations are correct', description: 'Verify deductions meet local requirements', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 9, satisfaction: 4, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Execute monthly payroll runs globally', description: 'Process payroll accurately across all locations', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 9, satisfaction: 5, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Conclude year-end tax filings per country', description: 'Complete annual tax reporting requirements', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'conclude', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  
  // DIFFERENTIATORS
  { title: 'Prepare multi-currency payment infrastructure', description: 'Set up banking and forex arrangements', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Monitor currency fluctuation impact on costs', description: 'Track forex exposure and budget implications', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize on-time payment rate across all currencies', 'execute', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 10, 5),
  outcome('Minimize payroll processing errors globally', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 9, 4),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Inability to reconcile different pay periods globally', 'define', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 7, 4),
  barrier('Unexpected currency volatility impacting budgets', 'monitor', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 3),
  
  // EMOTIONAL
  { title: 'Feel secure about payment accuracy', description: 'Trust that employees are paid correctly every time', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'emotional', notes: '', importance: 9, satisfaction: 6, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  { title: 'Feel confident about tax compliance', description: 'Trust withholdings and filings are correct', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'emotional', notes: '', importance: 8, satisfaction: 5, job_stage: 'conclude', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },
  
  // SOCIAL
  { title: 'Be trusted by employees for reliable pay', description: 'Build reputation for never missing payroll', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'social', notes: '', importance: 8, satisfaction: 6, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MANAGE_PAYROLL },

  // ========== L1/L2 JOBS FOR: Establish entity structure ==========
  // STEPS
  { title: 'Define entity requirements per target market', description: 'Determine what legal structures are needed', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Locate corporate formation specialists', description: 'Find lawyers who can set up entities locally', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Prepare incorporation documents', description: 'Draft articles of incorporation and bylaws', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Confirm capital requirements are met', description: 'Ensure sufficient funding for entity formation', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 6, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Execute entity registration filings', description: 'Submit all required registration documents', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Monitor ongoing compliance requirements', description: 'Track annual filings and corporate governance', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  
  // DIFFERENTIATORS
  { title: 'Set up local bank accounts for entity', description: 'Establish banking relationships in-country', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  { title: 'Register for local tax identification', description: 'Obtain all required tax registrations', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize time to achieve operational entity status', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 9, 4),
  outcome('Minimize delays in entity formation process', 'conclude', 'ceo', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Bureaucratic delays that extend registration timelines', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 3),
  barrier('Lack of clarity on minimum capital requirements by jurisdiction', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 4),
  
  // EMOTIONAL
  { title: 'Feel confident about corporate structure', description: 'Trust entity is properly set up', level: 1, parent_id: null, icp: 'ceo', job_type: 'emotional', notes: '', importance: 7, satisfaction: 5, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },
  
  // SOCIAL
  { title: 'Be recognized as a legitimate local presence', description: 'Build credibility in the market', level: 1, parent_id: null, icp: 'ceo', job_type: 'social', notes: '', importance: 6, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.ESTABLISH_ENTITY },

  // ========== L1/L2 JOBS FOR: Navigate visa and work permit processes ==========
  // STEPS
  { title: 'Define visa sponsorship policy for the company', description: 'Establish criteria for when to sponsor work visas', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Locate immigration attorneys in key countries', description: 'Build network of trusted immigration legal partners', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Confirm employee eligibility for visa type', description: 'Verify qualifications match visa requirements', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Execute visa applications within required timelines', description: 'Submit applications before deadlines with complete materials', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: 'challenge: unpredictable processing times', importance: 9, satisfaction: 3, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Monitor visa expiration dates and renewals', description: 'Track work authorization status for all employees', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Conclude permanent residency applications', description: 'Support employees seeking long-term status', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 4, job_stage: 'conclude', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  
  // DIFFERENTIATORS
  { title: 'Prepare visa application documentation packages', description: 'Compile required documents for each visa type', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Build visa tracking system', description: 'Implement technology to manage immigration cases', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 3, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize visa approval rate for sponsored employees', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 9, 4),
  outcome('Minimize immigration compliance violations', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.NAVIGATE_VISAS, 10, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Unpredictable visa application rejections', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 3),
  barrier('Lack of advance notice on immigration policy changes', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.NAVIGATE_VISAS, 7, 3),
  
  // EMOTIONAL
  { title: 'Avoid immigration compliance violations', description: 'Prevent issues that could result in fines or bans', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'emotional', notes: 'barrier: complex and changing regulations', importance: 9, satisfaction: 3, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  { title: 'Feel secure about employee work status', description: 'Confidence all employees are properly authorized', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'emotional', notes: '', importance: 8, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },
  
  // SOCIAL
  { title: 'Be known for supporting employee mobility', description: 'Reputation for helping with relocation', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'social', notes: '', importance: 5, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.NAVIGATE_VISAS },

  // ========== L1/L2 JOBS FOR: Create unified company culture ==========
  // STEPS
  { title: 'Define core cultural values for global workforce', description: 'Articulate values that transcend geographic boundaries', level: 1, parent_id: null, icp: 'ceo', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Locate cultural ambassadors in each region', description: 'Identify local leaders to champion company culture', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Prepare cultural onboarding materials', description: 'Create content that communicates values across cultures', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 4, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Execute global all-hands meetings across time zones', description: 'Host inclusive company-wide meetings that work globally', level: 1, parent_id: null, icp: 'ceo', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Monitor employee engagement across regions', description: 'Track culture and engagement metrics by location', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Modify cultural initiatives based on feedback', description: 'Adapt programs to local needs while maintaining core values', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 5, job_stage: 'modify', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  
  // DIFFERENTIATORS
  { title: 'Create virtual team-building experiences', description: 'Design engaging remote activities that build connection', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Build internal communications platform', description: 'Implement tools for async global communication', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize employee engagement scores across all regions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 9, 4),
  outcome('Minimize cultural friction in cross-functional teams', 'execute', 'hiring_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Language and communication gaps across teams', 'execute', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 3),
  barrier('Time zone constraints limiting real-time collaboration', 'execute', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 4),
  
  // EMOTIONAL
  { title: 'Feel connected despite physical distance', description: 'Employees feel part of something bigger', level: 1, parent_id: null, icp: 'ceo', job_type: 'emotional', notes: '', importance: 8, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Feel proud of company culture', description: 'Take pride in how we work together', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'emotional', notes: '', importance: 7, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  
  // SOCIAL
  { title: 'Be seen as an inclusive global employer', description: 'Build reputation for valuing diverse perspectives', level: 1, parent_id: null, icp: 'ceo', job_type: 'social', notes: '', importance: 7, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },
  { title: 'Attract talent with strong culture reputation', description: 'Use culture as competitive advantage', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'social', notes: '', importance: 6, satisfaction: 4, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.CREATE_CULTURE },

  // ========== L1/L2 JOBS FOR: Monitor employee performance remotely ==========
  // STEPS
  { title: 'Define performance metrics for remote roles', description: 'Establish clear KPIs that work for distributed teams', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Locate performance management tools for global teams', description: 'Select software that supports async feedback', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Prepare performance review templates', description: 'Create consistent evaluation frameworks', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Execute regular 1:1s across time zones', description: 'Maintain consistent check-ins despite geography', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Monitor productivity without micromanaging', description: 'Track outcomes while respecting autonomy', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: 'barrier: finding right balance of visibility', importance: 7, satisfaction: 3, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Conclude annual performance reviews globally', description: 'Complete consistent evaluations across all locations', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'conclude', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  
  // DIFFERENTIATORS
  { title: 'Implement continuous feedback system', description: 'Enable real-time performance conversations', level: 2, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Create remote performance dashboards', description: 'Build visibility into team productivity metrics', level: 2, parent_id: null, icp: 'hiring_manager', job_type: 'functional', notes: '', importance: 5, satisfaction: 3, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize consistency of performance standards across locations', 'execute', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 9, 4),
  outcome('Minimize bias in identifying high performers by location', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 4),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Limited visibility into remote employee engagement', 'execute', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 3),
  barrier('Cultural differences affecting feedback interpretation', 'prepare', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 7, 4),
  
  // EMOTIONAL
  { title: 'Feel trusted while working remotely', description: 'Employees feel empowered not surveilled', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'emotional', notes: '', importance: 8, satisfaction: 5, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  { title: 'Feel confident about team productivity', description: 'Trust that work is getting done', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'emotional', notes: '', importance: 7, satisfaction: 4, job_stage: 'monitor', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },
  
  // SOCIAL
  { title: 'Be recognized for fair management practices', description: 'Reputation for equitable treatment', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'social', notes: '', importance: 6, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.MONITOR_PERFORMANCE },

  // ========== L1/L2 JOBS FOR: Handle cross-border terminations ==========
  // STEPS
  { title: 'Define termination procedures per jurisdiction', description: 'Document compliant offboarding process for each country', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 8, satisfaction: 4, job_stage: 'define', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Locate employment litigation counsel per region', description: 'Have legal support ready for contested terminations', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'locate', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Confirm notice period requirements per country', description: 'Verify legal notice requirements for terminations', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 8, satisfaction: 5, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Execute termination meetings with cultural sensitivity', description: 'Handle difficult conversations appropriately across cultures', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 7, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Conclude final payments and documentation', description: 'Complete all financial and legal obligations', level: 1, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 8, satisfaction: 6, job_stage: 'conclude', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Follow up on offboarding checklist completion', description: 'Ensure all items are completed post-termination', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'functional', notes: '', importance: 6, satisfaction: 6, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  
  // DIFFERENTIATORS
  { title: 'Prepare severance calculations per local law', description: 'Compute legally compliant separation packages', level: 2, parent_id: null, icp: 'head_of_finance', job_type: 'functional', notes: '', importance: 7, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Create termination documentation templates', description: 'Build country-specific termination letter templates', level: 2, parent_id: null, icp: 'head_of_legal', job_type: 'functional', notes: '', importance: 6, satisfaction: 5, job_stage: 'prepare', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize risk of legal claims from terminations', 'conclude', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 10, 5),
  outcome('Maximize protection of company intellectual property', 'execute', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 9, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Complex and varying severance requirements by country', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 8, 3),
  barrier('Disputed terminations requiring international litigation', 'execute', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 9, 3),
  
  // EMOTIONAL
  { title: 'Avoid wrongful termination lawsuits', description: 'Prevent legal action from former employees', level: 1, parent_id: null, icp: 'head_of_legal', job_type: 'emotional', notes: 'risk: varies greatly by country', importance: 9, satisfaction: 4, job_stage: 'execute', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Feel confident about termination decisions', description: 'Trust the process is fair and compliant', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'emotional', notes: '', importance: 7, satisfaction: 5, job_stage: 'confirm', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  
  // SOCIAL
  { title: 'Maintain positive employer brand post-termination', description: 'Ensure departing employees speak well of company', level: 1, parent_id: null, icp: 'hr_manager', job_type: 'social', notes: '', importance: 6, satisfaction: 5, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
  { title: 'Preserve team morale after terminations', description: 'Remaining team maintains trust in leadership', level: 1, parent_id: null, icp: 'hiring_manager', job_type: 'social', notes: '', importance: 7, satisfaction: 4, job_stage: 'follow_up', main_job_id: '__MAIN:' + MAIN_JOB_TITLES.HANDLE_TERMINATIONS },
];

export function generateSampleEdges(jobs: Job[]): Omit<Edge, 'id'>[] {
  const findJob = (title: string) => jobs.find(j => j.title.includes(title));
  const edges: Omit<Edge, 'id'>[] = [];
  
  // Helper to add edge if both jobs exist
  const addEdge = (sourceTitle: string, targetTitle: string, relationType: RelationType = 'depends_on', weight = 1) => {
    const source = findJob(sourceTitle);
    const target = findJob(targetTitle);
    if (source && target) {
      edges.push({
        source_id: source.id,
        target_id: target.id,
        relation_type: relationType,
        weight,
        notes: '',
      });
    }
  };
  
  // ========== EXPAND WORKFORCE dependencies ==========
  addEdge('Define expansion goals', 'Identify compliance requirements', 'enables');
  addEdge('Identify compliance requirements', 'Locate qualified legal counsel', 'depends_on');
  addEdge('Locate qualified legal counsel', 'Prepare compliance documentation', 'enables');
  addEdge('Assess talent availability', 'Calculate employment costs', 'influences');
  addEdge('Calculate employment costs', 'Confirm budget allocation', 'precedes');
  addEdge('Confirm budget allocation', 'Select entity structure', 'enables');
  addEdge('Select entity structure', 'Screen candidates for cultural', 'precedes');
  addEdge('Screen candidates for cultural', 'Execute employee onboarding', 'precedes');
  addEdge('Execute employee onboarding', 'Follow up on employee integration', 'precedes');
  addEdge('Feel confident about regulatory', 'Confirm budget allocation', 'influences');
  addEdge('Build trust with new international', 'Follow up on employee integration', 'influences');
  
  // ========== ENSURE COMPLIANCE dependencies ==========
  addEdge('Define regulatory monitoring scope', 'Locate reliable legal update', 'enables');
  addEdge('Locate reliable legal update', 'Prepare compliance checklist', 'enables');
  addEdge('Prepare compliance checklist', 'Execute quarterly compliance', 'enables');
  addEdge('Execute quarterly compliance', 'Monitor regulatory changes', 'enables');
  addEdge('Monitor regulatory changes', 'Modify policies when regulations', 'influences');
  addEdge('Feel assured about legal exposure', 'Execute quarterly compliance', 'influences');
  
  // ========== BUILD COMPENSATION dependencies ==========
  addEdge('Define compensation philosophy', 'Locate salary benchmarking', 'enables');
  addEdge('Locate salary benchmarking', 'Prepare salary bands', 'enables');
  addEdge('Prepare salary bands', 'Confirm benefits packages', 'precedes');
  addEdge('Confirm benefits packages', 'Execute annual compensation', 'enables');
  addEdge('Execute annual compensation', 'Monitor market rate changes', 'enables');
  addEdge('Feel confident about talent retention', 'Execute annual compensation', 'influences');
  
  // ========== ONBOARD EMPLOYEES dependencies ==========
  addEdge('Define onboarding standards', 'Locate local onboarding partners', 'enables');
  addEdge('Locate local onboarding partners', 'Prepare onboarding materials', 'enables');
  addEdge('Prepare onboarding materials', 'Confirm IT equipment delivery', 'precedes');
  addEdge('Confirm IT equipment delivery', 'Execute virtual orientation', 'precedes');
  addEdge('Execute virtual orientation', 'Monitor new hire ramp-up', 'enables');
  addEdge('Monitor new hire ramp-up', 'Follow up on 30/60/90', 'precedes');
  addEdge('Feel welcomed despite physical', 'Execute virtual orientation', 'influences');
  
  // ========== MANAGE PAYROLL dependencies ==========
  addEdge('Define payroll processing timelines', 'Locate reliable payroll providers', 'enables');
  addEdge('Locate reliable payroll providers', 'Prepare multi-currency payment', 'enables');
  addEdge('Prepare multi-currency payment', 'Confirm tax withholding', 'precedes');
  addEdge('Confirm tax withholding', 'Execute monthly payroll', 'precedes');
  addEdge('Execute monthly payroll', 'Monitor currency fluctuation', 'enables');
  addEdge('Execute monthly payroll', 'Conclude year-end tax', 'precedes');
  addEdge('Feel secure about payment accuracy', 'Execute monthly payroll', 'influences');
  
  // ========== ESTABLISH ENTITY dependencies ==========
  addEdge('Define entity requirements', 'Locate corporate formation', 'enables');
  addEdge('Locate corporate formation', 'Prepare incorporation documents', 'enables');
  addEdge('Prepare incorporation documents', 'Confirm capital requirements', 'precedes');
  addEdge('Confirm capital requirements', 'Execute entity registration', 'precedes');
  addEdge('Execute entity registration', 'Set up local bank accounts', 'enables');
  addEdge('Execute entity registration', 'Register for local tax', 'enables');
  addEdge('Register for local tax', 'Monitor ongoing compliance', 'precedes');
  
  // ========== NAVIGATE VISAS dependencies ==========
  addEdge('Define visa sponsorship policy', 'Locate immigration attorneys', 'enables');
  addEdge('Locate immigration attorneys', 'Prepare visa application documentation', 'enables');
  addEdge('Prepare visa application documentation', 'Confirm employee eligibility', 'precedes');
  addEdge('Confirm employee eligibility', 'Execute visa applications', 'precedes');
  addEdge('Execute visa applications', 'Monitor visa expiration', 'enables');
  addEdge('Monitor visa expiration', 'Conclude permanent residency', 'influences');
  addEdge('Avoid immigration compliance', 'Monitor visa expiration', 'influences');
  
  // ========== CREATE CULTURE dependencies ==========
  addEdge('Define core cultural values', 'Locate cultural ambassadors', 'enables');
  addEdge('Locate cultural ambassadors', 'Prepare cultural onboarding', 'enables');
  addEdge('Prepare cultural onboarding', 'Build internal communications', 'enables');
  addEdge('Build internal communications', 'Execute global all-hands', 'enables');
  addEdge('Execute global all-hands', 'Create virtual team-building', 'enables');
  addEdge('Create virtual team-building', 'Monitor employee engagement', 'enables');
  addEdge('Monitor employee engagement', 'Modify cultural initiatives', 'influences');
  addEdge('Feel connected despite physical', 'Execute global all-hands', 'influences');
  
  // ========== MONITOR PERFORMANCE dependencies ==========
  addEdge('Define performance metrics', 'Locate performance management tools', 'enables');
  addEdge('Locate performance management tools', 'Prepare performance review', 'enables');
  addEdge('Prepare performance review', 'Execute regular 1:1s', 'enables');
  addEdge('Execute regular 1:1s', 'Monitor productivity without', 'enables');
  addEdge('Monitor productivity without', 'Implement continuous feedback', 'enables');
  addEdge('Monitor productivity without', 'Conclude annual performance', 'precedes');
  addEdge('Feel trusted while working', 'Monitor productivity without', 'influences');
  
  // ========== HANDLE TERMINATIONS dependencies ==========
  addEdge('Define termination procedures', 'Locate employment litigation', 'enables');
  addEdge('Locate employment litigation', 'Create termination documentation', 'enables');
  addEdge('Create termination documentation', 'Prepare severance calculations', 'enables');
  addEdge('Prepare severance calculations', 'Confirm notice period', 'precedes');
  addEdge('Confirm notice period', 'Execute termination meetings', 'precedes');
  addEdge('Execute termination meetings', 'Conclude final payments', 'precedes');
  addEdge('Conclude final payments', 'Follow up on offboarding', 'precedes');
  addEdge('Avoid wrongful termination', 'Execute termination meetings', 'influences');
  addEdge('Maintain positive employer brand', 'Follow up on offboarding', 'influences');
  
  // ========== CROSS-MAIN-JOB dependencies ==========
  // Compliance affects everything
  addEdge('Ensure compliance with labor', 'Expand workforce into new', 'influences', 2);
  addEdge('Ensure compliance with labor', 'Handle cross-border terminations', 'influences', 2);
  addEdge('Ensure compliance with labor', 'Manage payroll across multiple', 'influences', 2);
  
  // Entity structure enables hiring
  addEdge('Establish entity structure', 'Expand workforce into new', 'enables', 2);
  addEdge('Establish entity structure', 'Manage payroll across multiple', 'enables', 2);
  
  // Compensation affects onboarding and culture
  addEdge('Build competitive compensation', 'Onboard distributed employees', 'influences');
  addEdge('Build competitive compensation', 'Create unified company culture', 'influences');
  
  // Onboarding affects performance and culture
  addEdge('Onboard distributed employees', 'Monitor employee performance', 'enables');
  addEdge('Onboard distributed employees', 'Create unified company culture', 'influences');
  
  // Culture affects performance
  addEdge('Create unified company culture', 'Monitor employee performance', 'influences');
  
  // Visas affect expansion
  addEdge('Navigate visa and work permit', 'Expand workforce into new', 'influences');
  
  return edges;
}

export function resolveMainJobIds(jobs: Job[]): Job[] {
  // Build a map from title to id for L0 jobs
  const titleToId = new Map<string, string>();
  jobs.forEach(job => {
    if (job.level === 0) {
      titleToId.set(job.title, job.id);
    }
  });
  
  // Resolve __MAIN: references
  return jobs.map(job => {
    if (job.main_job_id && job.main_job_id.startsWith('__MAIN:')) {
      const mainTitle = job.main_job_id.replace('__MAIN:', '');
      const resolvedId = titleToId.get(mainTitle);
      return { ...job, main_job_id: resolvedId || null };
    }
    return job;
  });
}
