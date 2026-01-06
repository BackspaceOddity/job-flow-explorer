import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { useGraph } from '@/context/GraphContext';
import { Job, Edge } from '@/types/graph';
import { JOB_TYPE_HEX } from '@/components/JobTypeBadge';
import { cn } from '@/lib/utils';

interface GraphVisualizationProps {
  className?: string;
}

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  job: Job;
  tensionScore: number;
  isOnCriticalPath: boolean;
  isInCycle: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  edge: Edge;
  isOnCriticalPath: boolean;
}

export function GraphVisualization({ className }: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { state, filteredData, setSelectedNode, setHoveredNode } = useGraph();
  const { selectedNodeId, hoveredNodeId, showCriticalPath, showLoops } = state.viewState;

  const { nodes, links } = useMemo(() => {
    const nodes: SimNode[] = filteredData.jobs.map(job => {
      const metrics = state.metrics?.nodes.get(job.id);
      return {
        id: job.id,
        job,
        tensionScore: metrics?.tensionScore || 0,
        isOnCriticalPath: metrics?.isOnCriticalPath || false,
        isInCycle: metrics?.isInCycle || false,
      };
    });

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const links: SimLink[] = filteredData.edges
      .filter(edge => nodeMap.has(edge.source_id) && nodeMap.has(edge.target_id))
      .map(edge => ({
        source: nodeMap.get(edge.source_id)!,
        target: nodeMap.get(edge.target_id)!,
        edge,
        isOnCriticalPath: state.metrics?.edges.get(edge.id)?.isOnCriticalPath || false,
      }));

    return { nodes, links };
  }, [filteredData, state.metrics]);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    svg.selectAll('*').remove();

    // Defs for arrow markers
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', 'hsl(224 15% 35%)');

    defs.append('marker')
      .attr('id', 'arrowhead-critical')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10,0 L 0,5')
      .attr('fill', '#f59e0b');

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // Simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => (showCriticalPath && d.isOnCriticalPath) ? '#f59e0b' : 'hsl(224 15% 35%)')
      .attr('stroke-width', d => Math.max(1, d.edge.weight * 1.5))
      .attr('stroke-opacity', 0.6)
      .attr('marker-end', d => (showCriticalPath && d.isOnCriticalPath) ? 'url(#arrowhead-critical)' : 'url(#arrowhead)');

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Node circles
    node.append('circle')
      .attr('r', d => 8 + (d.tensionScore / 10))
      .attr('fill', d => JOB_TYPE_HEX[d.job.job_type])
      .attr('stroke', d => {
        if (selectedNodeId === d.id) return '#fff';
        if (showCriticalPath && d.isOnCriticalPath) return '#f59e0b';
        if (showLoops && d.isInCycle) return '#ef4444';
        return 'transparent';
      })
      .attr('stroke-width', d => (selectedNodeId === d.id || (showCriticalPath && d.isOnCriticalPath)) ? 3 : 2);

    // Labels
    node.append('text')
      .text(d => d.job.title.length > 20 ? d.job.title.slice(0, 20) + '...' : d.job.title)
      .attr('x', 0)
      .attr('y', d => 20 + (d.tensionScore / 10))
      .attr('text-anchor', 'middle')
      .attr('fill', 'hsl(210 20% 85%)')
      .attr('font-size', '10px')
      .attr('pointer-events', 'none');

    node.on('click', (_, d) => setSelectedNode(d.id))
      .on('mouseenter', (_, d) => setHoveredNode(d.id))
      .on('mouseleave', () => setHoveredNode(null));

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimNode).x!)
        .attr('y1', d => (d.source as SimNode).y!)
        .attr('x2', d => (d.target as SimNode).x!)
        .attr('y2', d => (d.target as SimNode).y!);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [nodes, links, selectedNodeId, showCriticalPath, showLoops, setSelectedNode, setHoveredNode]);

  if (nodes.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No jobs to display</p>
          <p className="text-sm">Create jobs and edges to visualize your graph</p>
        </div>
      </div>
    );
  }

  return <svg ref={svgRef} className={cn('w-full h-full bg-background', className)} />;
}
