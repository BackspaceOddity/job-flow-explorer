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
  step('Locate salary benchmarking data per market', 'locate', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 4),
  step('Confirm benefits packages meet local expectations', 'confirm', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 4),
  step('Execute annual compensation reviews globally', 'execute', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 5),
  step('Monitor market rate changes continuously', 'monitor', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 6, 4),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When in multiple markets: Location-adjusted salary bands needed', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 5),
  differentiator('When offering equity globally: International stock option complexity', 'execute', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 6, 3),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize candidate acceptance rate through competitive offers', 'execute', 'hiring_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 9, 4),
  outcome('Minimize pay equity gaps across regions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Tension between cost constraints and market competitiveness', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 3),
  barrier('Lack of clarity on pay transparency requirements by country', 'execute', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 4),
  
  // EMOTIONAL
  emotional('Feel confident about talent retention', 'execute', 'ceo', MAIN_JOB_TITLES.BUILD_COMPENSATION, 8, 4),
  emotional('Feel fair about compensation decisions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.BUILD_COMPENSATION, 7, 5),
  
  // SOCIAL
  social('Be known for fair pay practices', 'follow_up', 'ceo', MAIN_JOB_TITLES.BUILD_COMPENSATION, 6, 5),

  // ========== L1/L2 JOBS FOR: Onboard distributed employees ==========
  // STEPS
  step('Define onboarding standards for remote employees', 'define', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 4),
  step('Locate local onboarding partners where needed', 'locate', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 6, 5),
  step('Confirm IT equipment delivery before start date', 'confirm', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 3),
  step('Execute virtual orientation sessions across time zones', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 3),
  step('Monitor new hire ramp-up progress', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 4),
  step('Follow up on 30/60/90 day check-ins', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 6, 5),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When onboarding non-English speakers: Translated materials required', 'prepare', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 6, 5),
  differentiator('When integrating remote hires: Buddy system accelerates connection', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 5, 4),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize time to full productivity for new hires', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 9, 4),
  outcome('Minimize early turnover rate for remote employees', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Difficulty coordinating across multiple time zones', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 3),
  barrier('Unreliable equipment delivery to remote locations', 'confirm', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 3),
  
  // EMOTIONAL
  emotional('Feel welcomed despite physical distance', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 8, 3),
  emotional('Feel prepared for the role', 'confirm', 'hiring_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 4),
  
  // SOCIAL
  social('Be recognized as part of the team', 'follow_up', 'hiring_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 7, 4),
  social('Connect with colleagues across locations', 'execute', 'hr_manager', MAIN_JOB_TITLES.ONBOARD_EMPLOYEES, 6, 4),

  // ========== L1/L2 JOBS FOR: Manage payroll across multiple currencies ==========
  // STEPS
  step('Define payroll processing timelines per country', 'define', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 5),
  step('Locate reliable payroll providers per region', 'locate', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 4),
  step('Confirm tax withholding calculations are correct', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 9, 4),
  step('Execute monthly payroll runs globally', 'execute', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 9, 5),
  step('Conclude year-end tax filings per country', 'conclude', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 5),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When paying in multiple currencies: Banking and forex setup required', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 7, 5),
  differentiator('When budgeting globally: Currency volatility tracking needed', 'monitor', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 6, 5),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize on-time payment rate across all currencies', 'execute', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 10, 5),
  outcome('Minimize payroll processing errors globally', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 9, 4),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Inability to reconcile different pay periods globally', 'define', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 7, 4),
  barrier('Unexpected currency volatility impacting budgets', 'monitor', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 3),
  
  // EMOTIONAL
  emotional('Feel secure about payment accuracy', 'execute', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 9, 6),
  emotional('Feel confident about tax compliance', 'conclude', 'head_of_finance', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 5),
  
  // SOCIAL
  social('Be trusted by employees for reliable pay', 'execute', 'hr_manager', MAIN_JOB_TITLES.MANAGE_PAYROLL, 8, 6),

  // ========== L1/L2 JOBS FOR: Establish entity structure ==========
  // STEPS
  step('Define entity requirements per target market', 'define', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 4),
  step('Locate corporate formation specialists', 'locate', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 5),
  step('Prepare incorporation documents', 'prepare', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 5),
  step('Confirm capital requirements are met', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 6),
  step('Execute entity registration filings', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 4),
  step('Monitor ongoing compliance requirements', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 6, 5),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When establishing local presence: In-country banking required', 'execute', 'head_of_finance', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 4),
  differentiator('When operating legally: Local tax registration mandatory', 'execute', 'head_of_finance', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 5),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize time to achieve operational entity status', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 9, 4),
  outcome('Minimize delays in entity formation process', 'conclude', 'ceo', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Bureaucratic delays that extend registration timelines', 'execute', 'head_of_legal', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 8, 3),
  barrier('Lack of clarity on minimum capital requirements by jurisdiction', 'confirm', 'head_of_finance', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 4),
  
  // EMOTIONAL
  emotional('Feel confident about corporate structure', 'execute', 'ceo', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 7, 5),
  
  // SOCIAL
  social('Be recognized as a legitimate local presence', 'follow_up', 'ceo', MAIN_JOB_TITLES.ESTABLISH_ENTITY, 6, 5),

  // ========== L1/L2 JOBS FOR: Navigate visa and work permit processes ==========
  // STEPS
  step('Define visa sponsorship policy for the company', 'define', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 7, 5),
  step('Locate immigration attorneys in key countries', 'locate', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 4),
  step('Confirm employee eligibility for visa type', 'confirm', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 4),
  step('Execute visa applications within required timelines', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 9, 3),
  step('Monitor visa expiration dates and renewals', 'monitor', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 5),
  step('Conclude permanent residency applications', 'conclude', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 6, 4),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When sponsoring visas: Complete documentation package required', 'prepare', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 7, 4),
  differentiator('When managing multiple visas: Automated tracking system needed', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 5, 3),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize visa approval rate for sponsored employees', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 9, 4),
  outcome('Minimize immigration compliance violations', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.NAVIGATE_VISAS, 10, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Unpredictable visa application rejections', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 3),
  barrier('Lack of advance notice on immigration policy changes', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.NAVIGATE_VISAS, 7, 3),
  
  // EMOTIONAL
  emotional('Avoid anxiety about immigration compliance', 'monitor', 'head_of_legal', MAIN_JOB_TITLES.NAVIGATE_VISAS, 9, 3),
  emotional('Feel secure about employee work status', 'execute', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 8, 4),
  
  // SOCIAL
  social('Be known for supporting employee mobility', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.NAVIGATE_VISAS, 5, 5),

  // ========== L1/L2 JOBS FOR: Create unified company culture ==========
  // STEPS
  step('Define core cultural values for global workforce', 'define', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 5),
  step('Locate cultural ambassadors in each region', 'locate', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 6, 5),
  step('Prepare cultural onboarding materials', 'prepare', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 6, 4),
  step('Execute global all-hands meetings across time zones', 'execute', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 4),
  step('Monitor employee engagement across regions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 4),
  step('Modify cultural initiatives based on feedback', 'modify', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 5, 5),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When building remote culture: Virtual engagement activities needed', 'execute', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 5, 4),
  differentiator('When communicating globally: Async-first tools required', 'prepare', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 6, 5),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize employee engagement scores across all regions', 'monitor', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 9, 4),
  outcome('Minimize cultural friction in cross-functional teams', 'execute', 'hiring_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Language and communication gaps across teams', 'execute', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 3),
  barrier('Time zone constraints limiting real-time collaboration', 'execute', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 4),
  
  // EMOTIONAL
  emotional('Feel connected despite physical distance', 'execute', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 8, 4),
  emotional('Feel proud of company culture', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 5),
  
  // SOCIAL
  social('Be seen as an inclusive global employer', 'follow_up', 'ceo', MAIN_JOB_TITLES.CREATE_CULTURE, 7, 5),
  social('Attract talent with strong culture reputation', 'monitor', 'hr_manager', MAIN_JOB_TITLES.CREATE_CULTURE, 6, 4),

  // ========== L1/L2 JOBS FOR: Monitor employee performance remotely ==========
  // STEPS
  step('Define performance metrics for remote roles', 'define', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 4),
  step('Locate performance management tools for global teams', 'locate', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 6, 5),
  step('Prepare performance review templates', 'prepare', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 6, 5),
  step('Execute regular 1:1s across time zones', 'execute', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 4),
  step('Monitor productivity without micromanaging', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 7, 3),
  step('Conclude annual performance reviews globally', 'conclude', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 7, 5),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When managing remotely: Real-time feedback loops essential', 'execute', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 5, 4),
  differentiator('When tracking distributed teams: Visibility dashboards needed', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 5, 3),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Maximize consistency of performance standards across locations', 'execute', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 9, 4),
  outcome('Minimize bias in identifying high performers by location', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 4),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Limited visibility into remote employee engagement', 'execute', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 3),
  barrier('Cultural differences affecting feedback interpretation', 'prepare', 'hr_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 7, 4),
  
  // EMOTIONAL
  emotional('Feel trusted while working remotely', 'execute', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 8, 5),
  emotional('Feel confident about team productivity', 'monitor', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 7, 4),
  
  // SOCIAL
  social('Be recognized for fair management practices', 'follow_up', 'hiring_manager', MAIN_JOB_TITLES.MONITOR_PERFORMANCE, 6, 5),

  // ========== L1/L2 JOBS FOR: Handle cross-border terminations ==========
  // STEPS
  step('Define termination procedures per jurisdiction', 'define', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 8, 4),
  step('Locate employment litigation counsel per region', 'locate', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 7, 5),
  step('Confirm notice period requirements per country', 'confirm', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 8, 5),
  step('Execute termination meetings with cultural sensitivity', 'execute', 'hr_manager', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 7, 4),
  step('Conclude final payments and documentation', 'conclude', 'head_of_finance', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 8, 6),
  step('Follow up on offboarding checklist completion', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 6, 6),
  
  // DIFFERENTIATORS - Using "When [context]: [requirement]" syntax
  differentiator('When terminating internationally: Country-specific severance required', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 7, 5),
  differentiator('When offboarding globally: Jurisdiction-specific templates needed', 'prepare', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 6, 5),
  
  // OUTCOMES - Using "Minimize/Maximize [metric]" syntax
  outcome('Minimize risk of legal claims from terminations', 'conclude', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 10, 5),
  outcome('Maximize protection of company intellectual property', 'execute', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 9, 5),
  
  // BARRIERS - Using "Limited/Lack of [resource]" or "[Challenge] that [impact]" syntax
  barrier('Complex and varying severance requirements by country', 'prepare', 'head_of_finance', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 8, 3),
  barrier('Disputed terminations requiring international litigation', 'execute', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 9, 3),
  
  // EMOTIONAL
  emotional('Avoid wrongful termination lawsuit anxiety', 'execute', 'head_of_legal', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 9, 4),
  emotional('Feel confident about termination decisions', 'confirm', 'hr_manager', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 7, 5),
  
  // SOCIAL
  social('Maintain positive employer brand post-termination', 'follow_up', 'hr_manager', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 6, 5),
  social('Preserve team morale after terminations', 'follow_up', 'hiring_manager', MAIN_JOB_TITLES.HANDLE_TERMINATIONS, 7, 4),
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
