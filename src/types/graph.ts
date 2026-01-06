// Core types for Jobs Graph Mapper

export type JobType = 'functional' | 'emotional' | 'social' | 'other';

export type RelationType = 'depends_on' | 'enables' | 'precedes' | 'influences';

export type DirectionMode = 'before' | 'depends'; // A→B: "A before B" or "B depends on A"

export interface Job {
  id: string;
  title: string;
  description: string;
  level: number;
  parent_id: string | null;
  owner_role: string;
  job_type: JobType;
  notes: string;
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
}

export interface GraphFilters {
  ownerRoles: string[];
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
}

// Import/Export JSON schema
export interface ImportData {
  jobs: Array<{
    id: string;
    title: string;
    description?: string;
    level: number;
    parent_id: string | null;
    owner_role?: string;
    job_type: JobType;
    notes?: string;
  }>;
  edges: Array<{
    source_id: string;
    target_id: string;
    relation_type: RelationType;
    weight?: number;
    notes?: string;
  }>;
}
