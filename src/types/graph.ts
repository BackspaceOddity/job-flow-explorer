// Core types for Jobs Graph Mapper

export type JobType = 'functional' | 'emotional' | 'social';

export type ICP = 'ceo' | 'hr_manager' | 'head_of_finance' | 'hiring_manager' | 'head_of_legal';

export type RelationType = 'depends_on' | 'enables' | 'precedes' | 'influences';

export type DirectionMode = 'before' | 'depends'; // A→B: "A before B" or "B depends on A"

export type JobStage = 
  | 'define' | 'locate' | 'prepare' | 'confirm'  // Phase 1: Before
  | 'execute' | 'monitor' | 'modify'              // Phase 2: During
  | 'conclude' | 'follow_up';                     // Phase 3: After

export type ActiveView = 'graph' | 'jobmap' | 'matrix';

export const ICP_OPTIONS: { value: ICP; label: string }[] = [
  { value: 'ceo', label: 'CEO' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'head_of_finance', label: 'Head of Finance' },
  { value: 'hiring_manager', label: 'Hiring Manager' },
  { value: 'head_of_legal', label: 'Head of Legal' },
];

export interface Job {
  id: string;
  title: string;
  description: string;
  level: number;
  parent_id: string | null;
  icp: ICP;
  job_type: JobType;
  notes: string;
  // Underserved JTBD fields
  importance: number | null; // 1-10 scale
  satisfaction: number | null; // 1-10 scale
  // Job Map fields
  job_stage: JobStage | null;
  main_job_id: string | null; // Which main JTBD this is a sub-job of
}

export interface Edge {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: RelationType;
  weight: number;
  notes: string;
}

export interface GraphData {
  jobs: Job[];
  edges: Edge[];
}

export interface NodeMetrics {
  id: string;
  inDegree: number;
  outDegree: number;
  betweennessCentrality: number;
  closenessCentrality: number;
  pageRank: number;
  isInCycle: boolean;
  sccId: number | null;
  tensionScore: number;
  isOnCriticalPath: boolean;
}

export interface EdgeMetrics {
  id: string;
  edgeBetweenness: number;
  isOnCriticalPath: boolean;
}

export interface GraphMetrics {
  nodes: Map<string, NodeMetrics>;
  edges: Map<string, EdgeMetrics>;
  criticalPath: string[];
  sccs: string[][];
  cycles: string[][];
  topTensionNodes: string[];
  topUnderservedNodes: string[];
}

export interface GraphFilters {
  icps: ICP[];
  jobTypes: JobType[];
  levels: number[];
  searchQuery: string;
}

export interface SubgraphConfig {
  enabled: boolean;
  centerId: string | null;
  hops: number;
}

export interface ViewState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  filters: GraphFilters;
  subgraph: SubgraphConfig;
  showLoops: boolean;
  showCriticalPath: boolean;
  layout: 'force' | 'hierarchical';
  directionMode: DirectionMode;
  activeView: ActiveView;
  selectedMainJobId: string | null; // For job map view
}

// Import/Export JSON schema
export interface ImportData {
  jobs: Array<{
    id: string;
    title: string;
    description?: string;
    level: number;
    parent_id: string | null;
    icp?: ICP;
    job_type: JobType;
    notes?: string;
    importance?: number | null;
    satisfaction?: number | null;
    job_stage?: JobStage | null;
    main_job_id?: string | null;
  }>;
  edges: Array<{
    source_id: string;
    target_id: string;
    relation_type: RelationType;
    weight?: number;
    notes?: string;
  }>;
}

// Opportunity scoring helpers
export interface OpportunityScore {
  importance: number;
  satisfaction: number;
  opportunityScore: number; // importance + max(importance - satisfaction, 0)
  isUnderserved: boolean; // importance >= 5 AND satisfaction <= 5
  quadrant: 'opportunity' | 'appropriately_served' | 'over_served' | 'dont_invest';
}
