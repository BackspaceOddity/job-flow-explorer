// Graph algorithms for computing metrics and analysis

import type { Job, Edge, NodeMetrics, EdgeMetrics, GraphMetrics, GlobalGraphMetrics } from '@/types/graph';

// Adjacency list representation
interface AdjacencyList {
  outgoing: Map<string, string[]>;
  incoming: Map<string, string[]>;
}

function buildAdjacencyList(jobs: Job[], edges: Edge[]): AdjacencyList {
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  
  jobs.forEach(job => {
    outgoing.set(job.id, []);
    incoming.set(job.id, []);
  });
  
  edges.forEach(edge => {
    const out = outgoing.get(edge.source_id);
    const inc = incoming.get(edge.target_id);
    if (out) out.push(edge.target_id);
    if (inc) inc.push(edge.source_id);
  });
  
  return { outgoing, incoming };
}

// Build undirected adjacency for clustering coefficient
function buildUndirectedAdjacency(jobs: Job[], edges: Edge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  jobs.forEach(job => adj.set(job.id, new Set()));
  
  edges.forEach(edge => {
    adj.get(edge.source_id)?.add(edge.target_id);
    adj.get(edge.target_id)?.add(edge.source_id);
  });
  
  return adj;
}

// Compute in-degree and out-degree for all nodes
function computeDegrees(jobs: Job[], adj: AdjacencyList): Map<string, { inDegree: number; outDegree: number }> {
  const degrees = new Map<string, { inDegree: number; outDegree: number }>();
  
  jobs.forEach(job => {
    degrees.set(job.id, {
      inDegree: adj.incoming.get(job.id)?.length || 0,
      outDegree: adj.outgoing.get(job.id)?.length || 0,
    });
  });
  
  return degrees;
}

// Betweenness centrality using Brandes algorithm
function computeBetweennessCentrality(jobs: Job[], adj: AdjacencyList): Map<string, number> {
  const betweenness = new Map<string, number>();
  jobs.forEach(job => betweenness.set(job.id, 0));
  
  jobs.forEach(source => {
    const stack: string[] = [];
    const predecessors = new Map<string, string[]>();
    const sigma = new Map<string, number>(); // number of shortest paths
    const dist = new Map<string, number>();
    
    jobs.forEach(job => {
      predecessors.set(job.id, []);
      sigma.set(job.id, 0);
      dist.set(job.id, -1);
    });
    
    sigma.set(source.id, 1);
    dist.set(source.id, 0);
    
    const queue: string[] = [source.id];
    
    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      
      const neighbors = adj.outgoing.get(v) || [];
      for (const w of neighbors) {
        if (dist.get(w)! < 0) {
          queue.push(w);
          dist.set(w, dist.get(v)! + 1);
        }
        if (dist.get(w) === dist.get(v)! + 1) {
          sigma.set(w, sigma.get(w)! + sigma.get(v)!);
          predecessors.get(w)!.push(v);
        }
      }
    }
    
    const delta = new Map<string, number>();
    jobs.forEach(job => delta.set(job.id, 0));
    
    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of predecessors.get(w)!) {
        delta.set(v, delta.get(v)! + (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!));
      }
      if (w !== source.id) {
        betweenness.set(w, betweenness.get(w)! + delta.get(w)!);
      }
    }
  });
  
  // Normalize by (n-1)(n-2) for directed graphs
  const n = jobs.length;
  const normFactor = n > 2 ? (n - 1) * (n - 2) : 1;
  
  betweenness.forEach((val, key) => {
    betweenness.set(key, val / normFactor);
  });
  
  return betweenness;
}

// Closeness centrality
function computeClosenessCentrality(jobs: Job[], adj: AdjacencyList): Map<string, number> {
  const closeness = new Map<string, number>();
  
  jobs.forEach(source => {
    const dist = new Map<string, number>();
    jobs.forEach(job => dist.set(job.id, Infinity));
    dist.set(source.id, 0);
    
    const queue: string[] = [source.id];
    let reachable = 0;
    let totalDist = 0;
    
    while (queue.length > 0) {
      const v = queue.shift()!;
      const neighbors = adj.outgoing.get(v) || [];
      
      for (const w of neighbors) {
        if (dist.get(w) === Infinity) {
          dist.set(w, dist.get(v)! + 1);
          totalDist += dist.get(w)!;
          reachable++;
          queue.push(w);
        }
      }
    }
    
    // Closeness = (reachable nodes) / (sum of distances)
    if (reachable > 0 && totalDist > 0) {
      closeness.set(source.id, reachable / totalDist);
    } else {
      closeness.set(source.id, 0);
    }
  });
  
  return closeness;
}

// PageRank
function computePageRank(jobs: Job[], adj: AdjacencyList, damping = 0.85, iterations = 100): Map<string, number> {
  const n = jobs.length;
  if (n === 0) return new Map();
  
  const pageRank = new Map<string, number>();
  const newPageRank = new Map<string, number>();
  
  // Initialize with equal probability
  jobs.forEach(job => pageRank.set(job.id, 1 / n));
  
  for (let iter = 0; iter < iterations; iter++) {
    let danglingSum = 0;
    
    // Sum PageRank of dangling nodes (nodes with no outgoing edges)
    jobs.forEach(job => {
      if ((adj.outgoing.get(job.id)?.length || 0) === 0) {
        danglingSum += pageRank.get(job.id)!;
      }
    });
    
    jobs.forEach(job => {
      let sum = 0;
      const incoming = adj.incoming.get(job.id) || [];
      
      for (const source of incoming) {
        const outDegree = adj.outgoing.get(source)?.length || 1;
        sum += pageRank.get(source)! / outDegree;
      }
      
      // Add contribution from dangling nodes
      sum += danglingSum / n;
      
      newPageRank.set(job.id, (1 - damping) / n + damping * sum);
    });
    
    // Copy new values
    jobs.forEach(job => pageRank.set(job.id, newPageRank.get(job.id)!));
  }
  
  return pageRank;
}

// Eigenvector Centrality - measures influence based on neighbor importance
function computeEigenvectorCentrality(jobs: Job[], adj: AdjacencyList, iterations = 100, tolerance = 1e-6): Map<string, number> {
  const n = jobs.length;
  if (n === 0) return new Map();
  
  const centrality = new Map<string, number>();
  const newCentrality = new Map<string, number>();
  
  // Initialize with equal values
  jobs.forEach(job => centrality.set(job.id, 1 / Math.sqrt(n)));
  
  for (let iter = 0; iter < iterations; iter++) {
    // Compute new centrality scores
    jobs.forEach(job => {
      let sum = 0;
      const incoming = adj.incoming.get(job.id) || [];
      for (const neighbor of incoming) {
        sum += centrality.get(neighbor) || 0;
      }
      newCentrality.set(job.id, sum);
    });
    
    // Normalize
    let norm = 0;
    newCentrality.forEach(val => norm += val * val);
    norm = Math.sqrt(norm) || 1;
    
    let diff = 0;
    jobs.forEach(job => {
      const normalized = (newCentrality.get(job.id) || 0) / norm;
      diff += Math.abs(normalized - (centrality.get(job.id) || 0));
      centrality.set(job.id, normalized);
    });
    
    if (diff < tolerance) break;
  }
  
  return centrality;
}

// Clustering Coefficient - how clustered are a node's neighbors
function computeClusteringCoefficient(jobs: Job[], edges: Edge[]): Map<string, number> {
  const undirectedAdj = buildUndirectedAdjacency(jobs, edges);
  const clustering = new Map<string, number>();
  
  jobs.forEach(job => {
    const neighbors = Array.from(undirectedAdj.get(job.id) || []);
    const k = neighbors.length;
    
    if (k < 2) {
      clustering.set(job.id, 0);
      return;
    }
    
    // Count edges between neighbors
    let triangles = 0;
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        if (undirectedAdj.get(neighbors[i])?.has(neighbors[j])) {
          triangles++;
        }
      }
    }
    
    // Clustering coefficient = 2 * triangles / (k * (k-1))
    const maxTriangles = (k * (k - 1)) / 2;
    clustering.set(job.id, triangles / maxTriangles);
  });
  
  return clustering;
}

// Graph Density - edge density metric
function computeGraphDensity(jobs: Job[], edges: Edge[]): number {
  const n = jobs.length;
  if (n <= 1) return 0;
  
  // For directed graph: density = edges / (n * (n - 1))
  const maxEdges = n * (n - 1);
  return edges.length / maxEdges;
}

// Eccentricity - maximum distance from node to any other node
function computeEccentricity(jobs: Job[], adj: AdjacencyList): Map<string, number> {
  const eccentricity = new Map<string, number>();
  
  jobs.forEach(source => {
    const dist = new Map<string, number>();
    jobs.forEach(job => dist.set(job.id, Infinity));
    dist.set(source.id, 0);
    
    const queue: string[] = [source.id];
    
    while (queue.length > 0) {
      const v = queue.shift()!;
      const neighbors = [...(adj.outgoing.get(v) || []), ...(adj.incoming.get(v) || [])];
      
      for (const w of neighbors) {
        if (dist.get(w) === Infinity) {
          dist.set(w, dist.get(v)! + 1);
          queue.push(w);
        }
      }
    }
    
    // Max distance to any reachable node
    let maxDist = 0;
    dist.forEach(d => {
      if (d !== Infinity && d > maxDist) maxDist = d;
    });
    
    eccentricity.set(source.id, maxDist);
  });
  
  return eccentricity;
}

// Diameter - max eccentricity (longest shortest path)
function computeDiameter(eccentricities: Map<string, number>): number {
  let max = 0;
  eccentricities.forEach(e => {
    if (e > max) max = e;
  });
  return max;
}

// Radius - min eccentricity
function computeRadius(eccentricities: Map<string, number>): number {
  let min = Infinity;
  eccentricities.forEach(e => {
    if (e > 0 && e < min) min = e;
  });
  return min === Infinity ? 0 : min;
}

// Katz Centrality - considers all paths with decay
function computeKatzCentrality(jobs: Job[], adj: AdjacencyList, alpha = 0.1, beta = 1, iterations = 100): Map<string, number> {
  const n = jobs.length;
  if (n === 0) return new Map();
  
  const katz = new Map<string, number>();
  const newKatz = new Map<string, number>();
  
  // Initialize
  jobs.forEach(job => katz.set(job.id, beta));
  
  for (let iter = 0; iter < iterations; iter++) {
    jobs.forEach(job => {
      let sum = beta;
      const incoming = adj.incoming.get(job.id) || [];
      for (const neighbor of incoming) {
        sum += alpha * (katz.get(neighbor) || 0);
      }
      newKatz.set(job.id, sum);
    });
    
    // Copy
    jobs.forEach(job => katz.set(job.id, newKatz.get(job.id) || 0));
  }
  
  // Normalize
  let maxKatz = 0;
  katz.forEach(val => { if (val > maxKatz) maxKatz = val; });
  if (maxKatz > 0) {
    katz.forEach((val, key) => katz.set(key, val / maxKatz));
  }
  
  return katz;
}

// HITS Algorithm - Hubs and Authorities
function computeHITS(jobs: Job[], adj: AdjacencyList, iterations = 100): { hubs: Map<string, number>; authorities: Map<string, number> } {
  const n = jobs.length;
  if (n === 0) return { hubs: new Map(), authorities: new Map() };
  
  const hubs = new Map<string, number>();
  const authorities = new Map<string, number>();
  
  // Initialize
  jobs.forEach(job => {
    hubs.set(job.id, 1);
    authorities.set(job.id, 1);
  });
  
  for (let iter = 0; iter < iterations; iter++) {
    // Update authority scores: sum of hub scores of incoming nodes
    jobs.forEach(job => {
      let sum = 0;
      const incoming = adj.incoming.get(job.id) || [];
      for (const neighbor of incoming) {
        sum += hubs.get(neighbor) || 0;
      }
      authorities.set(job.id, sum);
    });
    
    // Normalize authorities
    let authNorm = 0;
    authorities.forEach(val => authNorm += val * val);
    authNorm = Math.sqrt(authNorm) || 1;
    authorities.forEach((val, key) => authorities.set(key, val / authNorm));
    
    // Update hub scores: sum of authority scores of outgoing nodes
    jobs.forEach(job => {
      let sum = 0;
      const outgoing = adj.outgoing.get(job.id) || [];
      for (const neighbor of outgoing) {
        sum += authorities.get(neighbor) || 0;
      }
      hubs.set(job.id, sum);
    });
    
    // Normalize hubs
    let hubNorm = 0;
    hubs.forEach(val => hubNorm += val * val);
    hubNorm = Math.sqrt(hubNorm) || 1;
    hubs.forEach((val, key) => hubs.set(key, val / hubNorm));
  }
  
  return { hubs, authorities };
}

// Community Detection using Label Propagation
function detectCommunities(jobs: Job[], edges: Edge[]): Map<string, number> {
  const undirectedAdj = buildUndirectedAdjacency(jobs, edges);
  const labels = new Map<string, number>();
  
  // Initialize each node with unique label
  jobs.forEach((job, idx) => labels.set(job.id, idx));
  
  const maxIterations = 100;
  for (let iter = 0; iter < maxIterations; iter++) {
    let changed = false;
    
    // Shuffle order for random propagation
    const shuffled = [...jobs].sort(() => Math.random() - 0.5);
    
    for (const job of shuffled) {
      const neighbors = undirectedAdj.get(job.id) || new Set();
      if (neighbors.size === 0) continue;
      
      // Count neighbor labels
      const labelCounts = new Map<number, number>();
      neighbors.forEach(neighbor => {
        const label = labels.get(neighbor)!;
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
      });
      
      // Find most common label
      let maxCount = 0;
      let maxLabel = labels.get(job.id)!;
      labelCounts.forEach((count, label) => {
        if (count > maxCount) {
          maxCount = count;
          maxLabel = label;
        }
      });
      
      if (labels.get(job.id) !== maxLabel) {
        labels.set(job.id, maxLabel);
        changed = true;
      }
    }
    
    if (!changed) break;
  }
  
  // Normalize labels to sequential IDs
  const uniqueLabels = [...new Set(labels.values())];
  const labelMap = new Map(uniqueLabels.map((label, idx) => [label, idx]));
  labels.forEach((label, nodeId) => {
    labels.set(nodeId, labelMap.get(label)!);
  });
  
  return labels;
}

// Tarjan's algorithm for strongly connected components
function computeSCCs(jobs: Job[], adj: AdjacencyList): string[][] {
  const index = new Map<string, number>();
  const lowlink = new Map<string, number>();
  const onStack = new Map<string, boolean>();
  const stack: string[] = [];
  const sccs: string[][] = [];
  let idx = 0;
  
  function strongConnect(v: string) {
    index.set(v, idx);
    lowlink.set(v, idx);
    idx++;
    stack.push(v);
    onStack.set(v, true);
    
    const neighbors = adj.outgoing.get(v) || [];
    for (const w of neighbors) {
      if (!index.has(w)) {
        strongConnect(w);
        lowlink.set(v, Math.min(lowlink.get(v)!, lowlink.get(w)!));
      } else if (onStack.get(w)) {
        lowlink.set(v, Math.min(lowlink.get(v)!, index.get(w)!));
      }
    }
    
    if (lowlink.get(v) === index.get(v)) {
      const scc: string[] = [];
      let w: string;
      do {
        w = stack.pop()!;
        onStack.set(w, false);
        scc.push(w);
      } while (w !== v);
      sccs.push(scc);
    }
  }
  
  jobs.forEach(job => {
    if (!index.has(job.id)) {
      strongConnect(job.id);
    }
  });
  
  return sccs;
}

// Detect cycles (SCCs with more than one node, or self-loops)
function detectCycles(jobs: Job[], edges: Edge[], sccs: string[][]): string[][] {
  const cycles: string[][] = [];
  
  // SCCs with more than one node are definitely cycles
  sccs.forEach(scc => {
    if (scc.length > 1) {
      cycles.push(scc);
    }
  });
  
  // Check for self-loops
  edges.forEach(edge => {
    if (edge.source_id === edge.target_id) {
      cycles.push([edge.source_id]);
    }
  });
  
  return cycles;
}

// Compute critical path (longest path in DAG or condensation graph)
function computeCriticalPath(jobs: Job[], edges: Edge[], adj: AdjacencyList, sccs: string[][]): string[] {
  const n = jobs.length;
  if (n === 0) return [];
  
  // Check if graph is DAG
  const hasCycles = sccs.some(scc => scc.length > 1);
  
  if (!hasCycles) {
    // Direct topological sort and longest path
    return longestPathDAG(jobs, adj);
  } else {
    // Condense SCCs and compute longest path on condensation graph
    return longestPathCondensation(jobs, adj, sccs);
  }
}

function topologicalSort(jobs: Job[], adj: AdjacencyList): string[] | null {
  const inDegree = new Map<string, number>();
  jobs.forEach(job => inDegree.set(job.id, adj.incoming.get(job.id)?.length || 0));
  
  const queue: string[] = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });
  
  const sorted: string[] = [];
  
  while (queue.length > 0) {
    const v = queue.shift()!;
    sorted.push(v);
    
    const neighbors = adj.outgoing.get(v) || [];
    for (const w of neighbors) {
      inDegree.set(w, inDegree.get(w)! - 1);
      if (inDegree.get(w) === 0) {
        queue.push(w);
      }
    }
  }
  
  return sorted.length === jobs.length ? sorted : null;
}

function longestPathDAG(jobs: Job[], adj: AdjacencyList): string[] {
  const sorted = topologicalSort(jobs, adj);
  if (!sorted) return [];
  
  const dist = new Map<string, number>();
  const pred = new Map<string, string | null>();
  
  sorted.forEach(id => {
    dist.set(id, 0);
    pred.set(id, null);
  });
  
  for (const v of sorted) {
    const neighbors = adj.outgoing.get(v) || [];
    for (const w of neighbors) {
      if (dist.get(w)! < dist.get(v)! + 1) {
        dist.set(w, dist.get(v)! + 1);
        pred.set(w, v);
      }
    }
  }
  
  // Find node with maximum distance
  let maxDist = 0;
  let endNode = sorted[0];
  dist.forEach((d, id) => {
    if (d > maxDist) {
      maxDist = d;
      endNode = id;
    }
  });
  
  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endNode;
  while (current !== null) {
    path.unshift(current);
    current = pred.get(current) || null;
  }
  
  return path;
}

function longestPathCondensation(jobs: Job[], adj: AdjacencyList, sccs: string[][]): string[] {
  // Map each node to its SCC index
  const nodeToSCC = new Map<string, number>();
  sccs.forEach((scc, idx) => {
    scc.forEach(node => nodeToSCC.set(node, idx));
  });
  
  // Build condensation graph
  const condAdj = new Map<number, Set<number>>();
  sccs.forEach((_, idx) => condAdj.set(idx, new Set()));
  
  jobs.forEach(job => {
    const sccId = nodeToSCC.get(job.id)!;
    const neighbors = adj.outgoing.get(job.id) || [];
    for (const neighbor of neighbors) {
      const neighborSCC = nodeToSCC.get(neighbor)!;
      if (sccId !== neighborSCC) {
        condAdj.get(sccId)!.add(neighborSCC);
      }
    }
  });
  
  // Topological sort on condensation
  const inDegree = new Map<number, number>();
  sccs.forEach((_, idx) => inDegree.set(idx, 0));
  
  condAdj.forEach((neighbors) => {
    neighbors.forEach(n => inDegree.set(n, inDegree.get(n)! + 1));
  });
  
  const queue: number[] = [];
  inDegree.forEach((deg, idx) => {
    if (deg === 0) queue.push(idx);
  });
  
  const sorted: number[] = [];
  while (queue.length > 0) {
    const v = queue.shift()!;
    sorted.push(v);
    condAdj.get(v)?.forEach(w => {
      inDegree.set(w, inDegree.get(w)! - 1);
      if (inDegree.get(w) === 0) queue.push(w);
    });
  }
  
  // Longest path on condensation
  const dist = new Map<number, number>();
  const pred = new Map<number, number | null>();
  sorted.forEach(idx => {
    dist.set(idx, sccs[idx].length); // Weight by SCC size
    pred.set(idx, null);
  });
  
  for (const v of sorted) {
    condAdj.get(v)?.forEach(w => {
      const newDist = dist.get(v)! + sccs[w].length;
      if (newDist > dist.get(w)!) {
        dist.set(w, newDist);
        pred.set(w, v);
      }
    });
  }
  
  // Find max and reconstruct path
  let maxDist = 0;
  let endSCC = 0;
  dist.forEach((d, idx) => {
    if (d > maxDist) {
      maxDist = d;
      endSCC = idx;
    }
  });
  
  const sccPath: number[] = [];
  let current: number | null = endSCC;
  while (current !== null) {
    sccPath.unshift(current);
    current = pred.get(current) ?? null;
  }
  
  // Flatten SCC path to node path
  const path: string[] = [];
  sccPath.forEach(sccIdx => path.push(...sccs[sccIdx]));
  
  return path;
}

// Edge betweenness (simplified version)
function computeEdgeBetweenness(jobs: Job[], edges: Edge[], adj: AdjacencyList): Map<string, number> {
  const edgeBetweenness = new Map<string, number>();
  edges.forEach(edge => edgeBetweenness.set(edge.id, 0));
  
  const edgeMap = new Map<string, string>();
  edges.forEach(edge => edgeMap.set(`${edge.source_id}->${edge.target_id}`, edge.id));
  
  jobs.forEach(source => {
    const predecessors = new Map<string, string[]>();
    const sigma = new Map<string, number>();
    const dist = new Map<string, number>();
    const stack: string[] = [];
    
    jobs.forEach(job => {
      predecessors.set(job.id, []);
      sigma.set(job.id, 0);
      dist.set(job.id, -1);
    });
    
    sigma.set(source.id, 1);
    dist.set(source.id, 0);
    
    const queue: string[] = [source.id];
    
    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      
      const neighbors = adj.outgoing.get(v) || [];
      for (const w of neighbors) {
        if (dist.get(w)! < 0) {
          queue.push(w);
          dist.set(w, dist.get(v)! + 1);
        }
        if (dist.get(w) === dist.get(v)! + 1) {
          sigma.set(w, sigma.get(w)! + sigma.get(v)!);
          predecessors.get(w)!.push(v);
        }
      }
    }
    
    const delta = new Map<string, number>();
    jobs.forEach(job => delta.set(job.id, 0));
    
    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of predecessors.get(w)!) {
        const c = (sigma.get(v)! / sigma.get(w)!) * (1 + delta.get(w)!);
        delta.set(v, delta.get(v)! + c);
        
        const edgeKey = `${v}->${w}`;
        const edgeId = edgeMap.get(edgeKey);
        if (edgeId) {
          edgeBetweenness.set(edgeId, edgeBetweenness.get(edgeId)! + c);
        }
      }
    }
  });
  
  return edgeBetweenness;
}

// Compute tension score for each node
function computeTensionScores(
  jobs: Job[],
  betweenness: Map<string, number>,
  pageRank: Map<string, number>,
  degrees: Map<string, { inDegree: number; outDegree: number }>,
  nodesInCycles: Set<string>
): Map<string, number> {
  const tensionScores = new Map<string, number>();
  
  // Normalize values to 0-1
  const maxBetweenness = Math.max(...Array.from(betweenness.values()), 0.001);
  const maxPageRank = Math.max(...Array.from(pageRank.values()), 0.001);
  const maxDegree = Math.max(
    ...Array.from(degrees.values()).map(d => d.inDegree + d.outDegree),
    1
  );
  
  jobs.forEach(job => {
    const normalizedBetweenness = (betweenness.get(job.id) || 0) / maxBetweenness;
    const normalizedPageRank = (pageRank.get(job.id) || 0) / maxPageRank;
    const deg = degrees.get(job.id) || { inDegree: 0, outDegree: 0 };
    const normalizedDegree = (deg.inDegree + deg.outDegree) / maxDegree;
    const cycleBoost = nodesInCycles.has(job.id) ? 1 : 0;
    
    // Tension score formula:
    // 40% betweenness + 25% PageRank + 20% connectivity + 15% cycle membership
    const score = (
      0.40 * normalizedBetweenness +
      0.25 * normalizedPageRank +
      0.20 * normalizedDegree +
      0.15 * cycleBoost
    ) * 100;
    
    tensionScores.set(job.id, Math.round(score * 10) / 10);
  });
  
  return tensionScores;
}

// Main function to compute all metrics
export function computeGraphMetrics(jobs: Job[], edges: Edge[]): GraphMetrics {
  if (jobs.length === 0) {
    return {
      nodes: new Map(),
      edges: new Map(),
      criticalPath: [],
      sccs: [],
      cycles: [],
      topTensionNodes: [],
      topUnderservedNodes: [],
      globalMetrics: {
        density: 0,
        diameter: 0,
        radius: 0,
        averageClusteringCoefficient: 0,
        numberOfCommunities: 0,
        averagePathLength: 0,
      },
    };
  }
  
  const adj = buildAdjacencyList(jobs, edges);
  const degrees = computeDegrees(jobs, adj);
  const betweenness = computeBetweennessCentrality(jobs, adj);
  const closeness = computeClosenessCentrality(jobs, adj);
  const pageRank = computePageRank(jobs, adj);
  const sccs = computeSCCs(jobs, adj);
  const cycles = detectCycles(jobs, edges, sccs);
  const criticalPath = computeCriticalPath(jobs, edges, adj, sccs);
  const edgeBetweenness = computeEdgeBetweenness(jobs, edges, adj);
  
  // New metrics
  const eigenvector = computeEigenvectorCentrality(jobs, adj);
  const clustering = computeClusteringCoefficient(jobs, edges);
  const eccentricity = computeEccentricity(jobs, adj);
  const katz = computeKatzCentrality(jobs, adj);
  const hits = computeHITS(jobs, adj);
  const communities = detectCommunities(jobs, edges);
  
  // Global metrics
  const density = computeGraphDensity(jobs, edges);
  const diameter = computeDiameter(eccentricity);
  const radius = computeRadius(eccentricity);
  
  let avgClustering = 0;
  clustering.forEach(val => avgClustering += val);
  avgClustering = jobs.length > 0 ? avgClustering / jobs.length : 0;
  
  const uniqueCommunities = new Set(communities.values());
  
  // Find nodes in cycles
  const nodesInCycles = new Set<string>();
  cycles.forEach(cycle => cycle.forEach(node => nodesInCycles.add(node)));
  
  const tensionScores = computeTensionScores(jobs, betweenness, pageRank, degrees, nodesInCycles);
  
  // Map SCC to each node
  const nodeToSCC = new Map<string, number>();
  sccs.forEach((scc, idx) => {
    if (scc.length > 1) {
      scc.forEach(node => nodeToSCC.set(node, idx));
    }
  });
  
  // Critical path set for quick lookup
  const criticalPathSet = new Set(criticalPath);
  
  // Build node metrics map
  const nodeMetrics = new Map<string, NodeMetrics>();
  jobs.forEach(job => {
    const deg = degrees.get(job.id) || { inDegree: 0, outDegree: 0 };
    nodeMetrics.set(job.id, {
      id: job.id,
      inDegree: deg.inDegree,
      outDegree: deg.outDegree,
      betweennessCentrality: Math.round((betweenness.get(job.id) || 0) * 1000) / 1000,
      closenessCentrality: Math.round((closeness.get(job.id) || 0) * 1000) / 1000,
      pageRank: Math.round((pageRank.get(job.id) || 0) * 1000) / 1000,
      eigenvectorCentrality: Math.round((eigenvector.get(job.id) || 0) * 1000) / 1000,
      clusteringCoefficient: Math.round((clustering.get(job.id) || 0) * 1000) / 1000,
      eccentricity: eccentricity.get(job.id) || 0,
      katzCentrality: Math.round((katz.get(job.id) || 0) * 1000) / 1000,
      hubScore: Math.round((hits.hubs.get(job.id) || 0) * 1000) / 1000,
      authorityScore: Math.round((hits.authorities.get(job.id) || 0) * 1000) / 1000,
      communityId: communities.get(job.id) ?? null,
      isInCycle: nodesInCycles.has(job.id),
      sccId: nodeToSCC.get(job.id) ?? null,
      tensionScore: tensionScores.get(job.id) || 0,
      isOnCriticalPath: criticalPathSet.has(job.id),
    });
  });
  
  // Build edge metrics map
  const edgeMetricsMap = new Map<string, EdgeMetrics>();
  edges.forEach(edge => {
    const isOnPath = criticalPathSet.has(edge.source_id) && criticalPathSet.has(edge.target_id);
    edgeMetricsMap.set(edge.id, {
      id: edge.id,
      edgeBetweenness: Math.round((edgeBetweenness.get(edge.id) || 0) * 1000) / 1000,
      isOnCriticalPath: isOnPath,
    });
  });
  
  // Top tension nodes
  const sortedByTension = [...nodeMetrics.entries()]
    .sort((a, b) => b[1].tensionScore - a[1].tensionScore)
    .slice(0, 10)
    .map(([id]) => id);
  
  // Calculate average path length
  let totalPathLength = 0;
  let pathCount = 0;
  eccentricity.forEach(e => {
    if (e > 0) {
      totalPathLength += e;
      pathCount++;
    }
  });
  const averagePathLength = pathCount > 0 ? totalPathLength / pathCount : 0;
  
  return {
    nodes: nodeMetrics,
    edges: edgeMetricsMap,
    criticalPath,
    sccs: sccs.filter(scc => scc.length > 1),
    cycles,
    topTensionNodes: sortedByTension,
    topUnderservedNodes: [], // Populated by context with opportunity scoring
    globalMetrics: {
      density: Math.round(density * 1000) / 1000,
      diameter,
      radius,
      averageClusteringCoefficient: Math.round(avgClustering * 1000) / 1000,
      numberOfCommunities: uniqueCommunities.size,
      averagePathLength: Math.round(averagePathLength * 100) / 100,
    },
  };
}

// Get subgraph within N hops of a center node
export function getSubgraph(
  jobs: Job[],
  edges: Edge[],
  centerId: string,
  hops: number
): { jobs: Job[]; edges: Edge[] } {
  const adj = buildAdjacencyList(jobs, edges);
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [{ id: centerId, depth: 0 }];
  
  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (visited.has(id) || depth > hops) continue;
    visited.add(id);
    
    if (depth < hops) {
      const outgoing = adj.outgoing.get(id) || [];
      const incoming = adj.incoming.get(id) || [];
      [...outgoing, ...incoming].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          queue.push({ id: neighbor, depth: depth + 1 });
        }
      });
    }
  }
  
  const subJobs = jobs.filter(job => visited.has(job.id));
  const subEdges = edges.filter(
    edge => visited.has(edge.source_id) && visited.has(edge.target_id)
  );
  
  return { jobs: subJobs, edges: subEdges };
}
