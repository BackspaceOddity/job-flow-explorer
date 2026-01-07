import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { 
  Job, 
  Edge, 
  GraphData, 
  GraphMetrics, 
  ViewState, 
  GraphFilters,
  SubgraphConfig,
  DirectionMode,
  JobType,
  ICP,
  RelationType,
  ImportData,
  ActiveView
} from '@/types/graph';
import { computeGraphMetrics, getSubgraph } from '@/lib/graphAlgorithms';
import { getTopUnderservedJobs } from '@/lib/opportunityScoring';
import { sampleJobs, generateSampleEdges, resolveMainJobIds } from '@/data/sampleData';

const STORAGE_KEY = 'jobs-graph-mapper-data';

// State
interface GraphState {
  jobs: Job[];
  edges: Edge[];
  metrics: GraphMetrics | null;
  viewState: ViewState;
  isLoading: boolean;
  lastSaved: Date | null;
}

const initialViewState: ViewState = {
  selectedNodeId: null,
  hoveredNodeId: null,
  filters: {
    icps: [],
    jobTypes: [],
    levels: [],
    searchQuery: '',
  },
  subgraph: {
    enabled: false,
    centerId: null,
    hops: 2,
  },
  showLoops: false,
  showCriticalPath: false,
  layout: 'force',
  directionMode: 'before',
  activeView: 'graph',
  selectedMainJobId: null,
};

const initialState: GraphState = {
  jobs: [],
  edges: [],
  metrics: null,
  viewState: initialViewState,
  isLoading: true,
  lastSaved: null,
};

// Actions
type Action =
  | { type: 'LOAD_DATA'; payload: GraphData }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<Job> } }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'ADD_EDGE'; payload: Edge }
  | { type: 'UPDATE_EDGE'; payload: { id: string; updates: Partial<Edge> } }
  | { type: 'DELETE_EDGE'; payload: string }
  | { type: 'IMPORT_DATA'; payload: ImportData }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_METRICS'; payload: GraphMetrics }
  | { type: 'SET_SELECTED_NODE'; payload: string | null }
  | { type: 'SET_HOVERED_NODE'; payload: string | null }
  | { type: 'SET_FILTERS'; payload: Partial<GraphFilters> }
  | { type: 'SET_SUBGRAPH'; payload: Partial<SubgraphConfig> }
  | { type: 'TOGGLE_LOOPS' }
  | { type: 'TOGGLE_CRITICAL_PATH' }
  | { type: 'SET_LAYOUT'; payload: 'force' | 'hierarchical' }
  | { type: 'SET_DIRECTION_MODE'; payload: DirectionMode }
  | { type: 'SET_ACTIVE_VIEW'; payload: ActiveView }
  | { type: 'SET_SELECTED_MAIN_JOB'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVED'; payload: Date };

function reducer(state: GraphState, action: Action): GraphState {
  switch (action.type) {
    case 'LOAD_DATA':
      return {
        ...state,
        jobs: action.payload.jobs,
        edges: action.payload.edges,
        isLoading: false,
      };
    
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [...state.jobs, action.payload],
      };
    
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id ? { ...job, ...action.payload.updates } : job
        ),
      };
    
    case 'DELETE_JOB': {
      const jobId = action.payload;
      return {
        ...state,
        jobs: state.jobs.filter(job => job.id !== jobId),
        edges: state.edges.filter(edge => edge.source_id !== jobId && edge.target_id !== jobId),
        viewState: state.viewState.selectedNodeId === jobId
          ? { ...state.viewState, selectedNodeId: null }
          : state.viewState,
      };
    }
    
    case 'ADD_EDGE':
      return {
        ...state,
        edges: [...state.edges, action.payload],
      };
    
    case 'UPDATE_EDGE':
      return {
        ...state,
        edges: state.edges.map(edge =>
          edge.id === action.payload.id ? { ...edge, ...action.payload.updates } : edge
        ),
      };
    
    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(edge => edge.id !== action.payload),
      };
    
    case 'IMPORT_DATA': {
      const { jobs, edges } = action.payload;
      const importedJobs: Job[] = jobs.map(j => ({
        id: j.id,
        title: j.title,
        description: j.description || '',
        level: j.level,
        parent_id: j.parent_id,
        icp: j.icp || 'ceo',
        job_type: j.job_type,
        notes: j.notes || '',
        importance: j.importance ?? null,
        satisfaction: j.satisfaction ?? null,
        job_stage: j.job_stage ?? null,
        main_job_id: j.main_job_id ?? null,
      }));
      const importedEdges: Edge[] = edges.map(e => ({
        id: uuidv4(),
        source_id: e.source_id,
        target_id: e.target_id,
        relation_type: e.relation_type,
        weight: e.weight ?? 1,
        notes: e.notes || '',
      }));
      return {
        ...state,
        jobs: importedJobs,
        edges: importedEdges,
        viewState: initialViewState,
      };
    }
    
    case 'CLEAR_ALL':
      return {
        ...state,
        jobs: [],
        edges: [],
        metrics: null,
        viewState: initialViewState,
      };
    
    case 'SET_METRICS':
      return {
        ...state,
        metrics: action.payload,
      };
    
    case 'SET_SELECTED_NODE':
      return {
        ...state,
        viewState: { ...state.viewState, selectedNodeId: action.payload },
      };
    
    case 'SET_HOVERED_NODE':
      return {
        ...state,
        viewState: { ...state.viewState, hoveredNodeId: action.payload },
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        viewState: {
          ...state.viewState,
          filters: { ...state.viewState.filters, ...action.payload },
        },
      };
    
    case 'SET_SUBGRAPH':
      return {
        ...state,
        viewState: {
          ...state.viewState,
          subgraph: { ...state.viewState.subgraph, ...action.payload },
        },
      };
    
    case 'TOGGLE_LOOPS':
      return {
        ...state,
        viewState: { ...state.viewState, showLoops: !state.viewState.showLoops },
      };
    
    case 'TOGGLE_CRITICAL_PATH':
      return {
        ...state,
        viewState: { ...state.viewState, showCriticalPath: !state.viewState.showCriticalPath },
      };
    
    case 'SET_LAYOUT':
      return {
        ...state,
        viewState: { ...state.viewState, layout: action.payload },
      };
    
    case 'SET_DIRECTION_MODE':
      return {
        ...state,
        viewState: { ...state.viewState, directionMode: action.payload },
      };
    
    case 'SET_ACTIVE_VIEW':
      return {
        ...state,
        viewState: { ...state.viewState, activeView: action.payload },
      };
    
    case 'SET_SELECTED_MAIN_JOB':
      return {
        ...state,
        viewState: { ...state.viewState, selectedMainJobId: action.payload },
      };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SAVED':
      return { ...state, lastSaved: action.payload };
    
    default:
      return state;
  }
}

// Context
interface GraphContextValue {
  state: GraphState;
  // Job operations
  addJob: (job: Omit<Job, 'id'>) => Job;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  // Edge operations
  addEdge: (edge: Omit<Edge, 'id'>) => Edge;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  deleteEdge: (id: string) => void;
  // Data operations
  importData: (data: ImportData) => void;
  exportData: () => GraphData;
  clearAll: () => void;
  // Metrics
  recomputeMetrics: () => void;
  // View state
  setSelectedNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setFilters: (filters: Partial<GraphFilters>) => void;
  setSubgraph: (config: Partial<SubgraphConfig>) => void;
  toggleLoops: () => void;
  toggleCriticalPath: () => void;
  setLayout: (layout: 'force' | 'hierarchical') => void;
  setDirectionMode: (mode: DirectionMode) => void;
  setActiveView: (view: ActiveView) => void;
  setSelectedMainJob: (id: string | null) => void;
  // Computed values
  filteredData: { jobs: Job[]; edges: Edge[] };
  uniqueLevels: number[];
}

const GraphContext = createContext<GraphContextValue | null>(null);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored) as GraphData;
        // Migrate old data that doesn't have new fields
        const migratedJobs = data.jobs.map(job => ({
          ...job,
          icp: (job as any).icp || (job as any).owner_role || 'ceo',
          importance: (job as Job).importance ?? null,
          satisfaction: (job as Job).satisfaction ?? null,
          job_stage: (job as Job).job_stage ?? null,
          main_job_id: (job as Job).main_job_id ?? null,
        }));
        dispatch({ type: 'LOAD_DATA', payload: { jobs: migratedJobs, edges: data.edges } });
      } else {
        // Load sample data if no stored data
        const jobsWithIds: Job[] = sampleJobs.map(job => ({ ...job, id: uuidv4() }));
        const resolvedJobs = resolveMainJobIds(jobsWithIds);
        const edges = generateSampleEdges(resolvedJobs).map(e => ({ ...e, id: uuidv4() }));
        dispatch({ type: 'LOAD_DATA', payload: { jobs: resolvedJobs, edges } });
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);
  
  // Save to localStorage on changes
  useEffect(() => {
    if (state.isLoading) return;
    
    try {
      const data: GraphData = { jobs: state.jobs, edges: state.edges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      dispatch({ type: 'SET_SAVED', payload: new Date() });
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  }, [state.jobs, state.edges, state.isLoading]);
  
  // Recompute metrics when data changes
  useEffect(() => {
    if (state.jobs.length > 0) {
      const baseMetrics = computeGraphMetrics(state.jobs, state.edges);
      const topUnderservedNodes = getTopUnderservedJobs(state.jobs, 10);
      const metrics: GraphMetrics = {
        ...baseMetrics,
        topUnderservedNodes,
      };
      dispatch({ type: 'SET_METRICS', payload: metrics });
    }
  }, [state.jobs, state.edges]);
  
  // Job operations
  const addJob = useCallback((job: Omit<Job, 'id'>): Job => {
    const newJob: Job = { ...job, id: uuidv4() };
    dispatch({ type: 'ADD_JOB', payload: newJob });
    return newJob;
  }, []);
  
  const updateJob = useCallback((id: string, updates: Partial<Job>) => {
    dispatch({ type: 'UPDATE_JOB', payload: { id, updates } });
  }, []);
  
  const deleteJob = useCallback((id: string) => {
    dispatch({ type: 'DELETE_JOB', payload: id });
  }, []);
  
  // Edge operations
  const addEdge = useCallback((edge: Omit<Edge, 'id'>): Edge => {
    const newEdge: Edge = { ...edge, id: uuidv4() };
    dispatch({ type: 'ADD_EDGE', payload: newEdge });
    return newEdge;
  }, []);
  
  const updateEdge = useCallback((id: string, updates: Partial<Edge>) => {
    dispatch({ type: 'UPDATE_EDGE', payload: { id, updates } });
  }, []);
  
  const deleteEdge = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EDGE', payload: id });
  }, []);
  
  // Data operations
  const importData = useCallback((data: ImportData) => {
    dispatch({ type: 'IMPORT_DATA', payload: data });
  }, []);
  
  const exportData = useCallback((): GraphData => {
    return { jobs: state.jobs, edges: state.edges };
  }, [state.jobs, state.edges]);
  
  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);
  
  // Metrics
  const recomputeMetrics = useCallback(() => {
    const baseMetrics = computeGraphMetrics(state.jobs, state.edges);
    const topUnderservedNodes = getTopUnderservedJobs(state.jobs, 10);
    const metrics: GraphMetrics = {
      ...baseMetrics,
      topUnderservedNodes,
    };
    dispatch({ type: 'SET_METRICS', payload: metrics });
  }, [state.jobs, state.edges]);
  
  // View state
  const setSelectedNode = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_NODE', payload: id });
  }, []);
  
  const setHoveredNode = useCallback((id: string | null) => {
    dispatch({ type: 'SET_HOVERED_NODE', payload: id });
  }, []);
  
  const setFilters = useCallback((filters: Partial<GraphFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);
  
  const setSubgraph = useCallback((config: Partial<SubgraphConfig>) => {
    dispatch({ type: 'SET_SUBGRAPH', payload: config });
  }, []);
  
  const toggleLoops = useCallback(() => {
    dispatch({ type: 'TOGGLE_LOOPS' });
  }, []);
  
  const toggleCriticalPath = useCallback(() => {
    dispatch({ type: 'TOGGLE_CRITICAL_PATH' });
  }, []);
  
  const setLayout = useCallback((layout: 'force' | 'hierarchical') => {
    dispatch({ type: 'SET_LAYOUT', payload: layout });
  }, []);
  
  const setDirectionMode = useCallback((mode: DirectionMode) => {
    dispatch({ type: 'SET_DIRECTION_MODE', payload: mode });
  }, []);
  
  const setActiveView = useCallback((view: ActiveView) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  }, []);
  
  const setSelectedMainJob = useCallback((id: string | null) => {
    dispatch({ type: 'SET_SELECTED_MAIN_JOB', payload: id });
  }, []);
  
  // Computed: filtered data
  const filteredData = useMemo(() => {
    const { filters, subgraph } = state.viewState;
    
    let jobs = state.jobs;
    let edges = state.edges;
    
    // Apply subgraph filter first
    if (subgraph.enabled && subgraph.centerId) {
      const subgraphData = getSubgraph(state.jobs, state.edges, subgraph.centerId, subgraph.hops);
      jobs = subgraphData.jobs;
      edges = subgraphData.edges;
    }
    
    // Filter by ICPs
    if (filters.icps.length > 0) {
      jobs = jobs.filter(job => filters.icps.includes(job.icp));
    }
    
    // Filter by job types
    if (filters.jobTypes.length > 0) {
      jobs = jobs.filter(job => filters.jobTypes.includes(job.job_type));
    }
    
    // Filter by levels
    if (filters.levels.length > 0) {
      jobs = jobs.filter(job => filters.levels.includes(job.level));
    }
    
    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.id.toLowerCase().includes(query)
      );
    }
    
    // Filter edges to only include those between visible jobs
    const jobIds = new Set(jobs.map(j => j.id));
    edges = edges.filter(edge => jobIds.has(edge.source_id) && jobIds.has(edge.target_id));
    
    return { jobs, edges };
  }, [state.jobs, state.edges, state.viewState]);
  
  const uniqueLevels = useMemo(() => {
    const levels = new Set(state.jobs.map(j => j.level));
    return Array.from(levels).sort((a, b) => a - b);
  }, [state.jobs]);
  
  const value: GraphContextValue = {
    state,
    addJob,
    updateJob,
    deleteJob,
    addEdge,
    updateEdge,
    deleteEdge,
    importData,
    exportData,
    clearAll,
    recomputeMetrics,
    setSelectedNode,
    setHoveredNode,
    setFilters,
    setSubgraph,
    toggleLoops,
    toggleCriticalPath,
    setLayout,
    setDirectionMode,
    setActiveView,
    setSelectedMainJob,
    filteredData,
    uniqueLevels,
  };
  
  return (
    <GraphContext.Provider value={value}>
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  const context = useContext(GraphContext);
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider');
  }
  return context;
}
