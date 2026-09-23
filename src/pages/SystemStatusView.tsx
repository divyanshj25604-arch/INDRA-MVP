import React, { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Activity,
  Cpu,
  Database,
  Radio,
  Layers,
  ShieldCheck,
  TrendingUp,
  GitBranch,
} from 'lucide-react';
import { SystemServiceHealth } from '../types';

/*
  Why React Flow instead of hand-built CSS connectors:
  the old version computed trunk/split/merge lines with hard-coded
  percentages that only lined up at one exact width. React Flow lays
  out edges from each node's actual DOM position, so branches always
  meet correctly regardless of label length, node count, or viewport.
*/
interface SystemStatusViewProps {
  services: SystemServiceHealth[];
}

type Variant = 'blue' | 'purple' | 'cyan' | 'orange' | 'yellow' | 'red' | 'green';

const palette: Record<Variant, { border: string; icon: string; glow: string }> = {
  blue:   { border: '#2563EB', icon: '#60A5FA', glow: 'rgba(37, 99, 235, 0.18)' },
  purple: { border: '#7C3AED', icon: '#A78BFA', glow: 'rgba(124, 58, 237, 0.18)' },
  cyan:   { border: '#0891B2', icon: '#22D3EE', glow: 'rgba(8, 145, 178, 0.18)' },
  orange: { border: '#EA580C', icon: '#FB923C', glow: 'rgba(234, 88, 12, 0.18)' },
  yellow: { border: '#CA8A04', icon: '#FACC15', glow: 'rgba(202, 138, 4, 0.18)' },
  red:    { border: '#DC2626', icon: '#F87171', glow: 'rgba(220, 38, 38, 0.18)' },
  green:  { border: '#16A34A', icon: '#4ADE80', glow: 'rgba(22, 163, 74, 0.18)' },
};

const icons: Record<string, React.ReactNode> = {
  radio: <Radio size={16} />,
  layers: <Layers size={16} />,
  cpu: <Cpu size={16} />,
  activity: <Activity size={16} />,
  trend: <TrendingUp size={16} />,
  branch: <GitBranch size={16} />,
  db: <Database size={16} />,
  shield: <ShieldCheck size={16} />,
};

/* =========================================================
   CUSTOM NODE — visual identity kept from the original design
   ========================================================= */

type PipelineNodeData = {
  number: string;
  title: string;
  subtitle: string;
  icon: keyof typeof icons;
  variant: Variant;
};

const PipelineNode: React.FC<NodeProps<Node<PipelineNodeData>>> = ({ data }) => {
  const color = palette[data.variant];

  return (
    <div
      style={{
        width: 300,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        boxSizing: 'border-box',
        background: '#111F33',
        border: `1px solid ${color.border}`,
        borderRadius: '6px',
        boxShadow: `0 0 18px ${color.glow}`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color.border, border: 'none', width: 6, height: 6 }} />

      <div
        style={{
          width: 28,
          height: 28,
          minWidth: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${color.border}`,
          borderRadius: '4px',
          color: color.icon,
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          fontWeight: 700,
        }}
      >
        {data.number}
      </div>

      <div
        style={{
          width: 28,
          height: 28,
          minWidth: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color.icon,
          background: color.glow,
          borderRadius: '4px',
        }}
      >
        {icons[data.icon]}
      </div>

      <div style={{ minWidth: 0 }}>
        <div
          style={{
            color: '#F8FAFC',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.03em',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.title}
        </div>
        <div
          style={{
            marginTop: '3px',
            color: '#94A3B8',
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.subtitle}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: color.border, border: 'none', width: 6, height: 6 }} />
    </div>
  );
};

const nodeTypes = { pipeline: PipelineNode };

/* =========================================================
   GRAPH DATA — positions only set the rough layout;
   React Flow + smoothstep edges handle the actual routing.
   ========================================================= */

const COL = 340; // horizontal spacing between sibling branches
const ROW = 130;  // vertical spacing between steps

function buildGraph(): { nodes: Node<PipelineNodeData>[]; edges: Edge[] } {
  const n = (
    id: string,
    x: number,
    y: number,
    number: string,
    title: string,
    subtitle: string,
    icon: keyof typeof icons,
    variant: Variant,
  ): Node<PipelineNodeData> => ({
    id,
    type: 'pipeline',
    position: { x, y },
    data: { number, title, subtitle, icon, variant },
    draggable: false,
  });

  const nodes: Node<PipelineNodeData>[] = [
    n('01', 0, 0 * ROW, '01', 'INSAT / MOSDAC', 'Geostationary L1B IR & WV', 'radio', 'blue'),
    n('02', 0, 1 * ROW, '02', 'PREPROCESSING & LUT', 'Radiometric Normalization & Denoising', 'layers', 'blue'),
    n('03', 0, 2 * ROW, '03', 'DEEP VISION BACKBONE', 'EfficientNet-B0 + YOLOv8-Geo Detector', 'cpu', 'purple'),

    n('04A', -COL / 2, 3 * ROW, '04A', 'CYCLONE STATE TENSOR', 'Center · Wind · Pressure', 'activity', 'orange'),
    n('04B', COL / 2, 3 * ROW, '04B', 'STRUCTURE & EYE REGRESSION', 'Symmetry · Banding · CDO Density', 'trend', 'orange'),

    n('05', 0, 4 * ROW, '05', 'WEATHERNEXT CYCLONES', 'External Probabilistic Forecast Engine', 'cpu', 'purple'),
    n('06', 0, 5 * ROW, '06', '50-MEMBER ENSEMBLE SCENARIOS', 'Probabilistic Scenario Generation', 'branch', 'cyan'),

    n('07A', -COL, 6 * ROW, '07A', 'TRACK CONE', 'Probabilistic Track', 'trend', 'cyan'),
    n('07B', 0, 6 * ROW, '07B', 'INTENSITY TREND', 'Strength Evolution', 'activity', 'cyan'),
    n('07C', COL, 6 * ROW, '07C', 'WIND RADII', 'Spatial Wind Field', 'radio', 'cyan'),

    n('08', 0, 7 * ROW, '08', 'UNCERTAINTY ENGINE', 'Dispersion · Ensemble Spread · Consensus Index', 'layers', 'yellow'),
    n('09', 0, 8 * ROW, '09', 'RAPID INTENSIFICATION', 'Shear · SST Anomaly · Thermodynamic Signal', 'trend', 'red'),
    n('10', 0, 9 * ROW, '10', 'GEOSPATIAL RISK ENGINE', 'Hazard × Exposure × Vulnerability', 'db', 'red'),
    n('11', 0, 10 * ROW, '11', 'OPERATIONAL GIS & AUDIT', 'Command Center · Alerts · Transparency', 'shield', 'green'),
  ];

  const edgeDefs: [string, string, string][] = [
    ['01', '02', '#334155'],
    ['02', '03', '#334155'],
    ['03', '04A', '#EA580C'],
    ['03', '04B', '#EA580C'],
    ['04A', '05', '#7C3AED'],
    ['04B', '05', '#7C3AED'],
    ['05', '06', '#334155'],
    ['06', '07A', '#0891B2'],
    ['06', '07B', '#0891B2'],
    ['06', '07C', '#0891B2'],
    ['07A', '08', '#CA8A04'],
    ['07B', '08', '#CA8A04'],
    ['07C', '08', '#CA8A04'],
    ['08', '09', '#334155'],
    ['09', '10', '#334155'],
    ['10', '11', '#334155'],
  ];

  const edges: Edge[] = edgeDefs.map(([source, target, color]) => ({
    id: `${source}-${target}`,
    source,
    target,
    type: 'smoothstep',
    style: { stroke: color, strokeWidth: 1.25 },
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 14, height: 14 },
  }));

  return { nodes, edges };
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export const SystemStatusView: React.FC<SystemStatusViewProps> = ({ services }) => {
  const { nodes, edges } = useMemo(buildGraph, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* TOP BANNER */}
      <div className="panel" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} className="text-safe" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '0.03em', margin: 0 }}>
                SYSTEM HEALTH MONITORING &amp; END-TO-END PIPELINE ARCHITECTURE
              </h2>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Microservice Health Telemetry · Core 4 Pillars · 9-Phase Operational Architecture Flow
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span className="badge badge-safe">ALL 6 SUBSYSTEMS HEALTHY</span>
            <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
              HEARTBEAT: 14:28:22 IST
            </span>
          </div>
        </div>
      </div>

      {/* FOUR PILLARS */}
      <div className="panel">
        <div className="panel-header" style={{ background: '#F8FAFC' }}>
          <span>THE FOUR ARCHITECTURAL PILLARS OF CIFS</span>
          <span className="badge badge-info">PRODUCT CORE</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { n: '01', t: 'OBSERVE', c: '#1D4ED8', d: 'Automated computer vision extracts vortex cores, eye features, and intensity states directly from raw INSAT-3D/3DR thermal infrared imagery.' },
              { n: '02', t: 'FORECAST', c: '#EA580C', d: 'WeatherNext Cyclones probabilistic deep NWP backbone computes up to 15-day forward ensemble trajectories with multi-physics perturbations.' },
              { n: '03', t: 'QUANTIFY UNCERTAINTY', c: '#D97706', d: 'Instead of hiding uncertainty behind a single line, the platform projects 80% prediction regions, ensemble spread, and cross-model consensus.' },
              { n: '04', t: 'TRANSLATE TO IMPACT', c: '#DC2626', d: 'Meteorological variables are intersected with coastal district demographics and infrastructure to generate actionable decision support.' },
            ].map((p) => (
              <div key={p.n} style={{ background: '#F8FAFC', padding: '14px', border: '1px solid var(--border-color)', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="font-mono" style={{ fontSize: '16px', fontWeight: 800, color: p.c }}>{p.n}</span>
                  <strong style={{ fontSize: '12px', color: '#0F172A' }}>{p.t}</strong>
                </div>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* END-TO-END PIPELINE — React Flow canvas */}
      <div className="panel">
        <div className="panel-header">
          <span>END-TO-END SYSTEM PIPELINE ARCHITECTURE (DATA · INTELLIGENCE · DECISION)</span>
        </div>
        <div
          className="panel-body"
          style={{
            background: '#0B1727',
            borderRadius: '0 0 4px 4px',
            height: '1500px', // adjust to taste, or make responsive with ResizeObserver
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnScroll={false}
            panOnDrag={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            translateExtent={[
              [-500, -150],
              [800, 1500],
            ]}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1E293B" />
          </ReactFlow>
        </div>
      </div>

      {/* MICROSERVICES TELEMETRY */}
      <div className="panel">
        <div className="panel-header">
          <span>MICROSERVICES OPERATIONAL TELEMETRY</span>
          <span className="font-mono text-muted" style={{ fontSize: '10px' }}>PROD-CLUSTER-IN-WEST</span>
        </div>
        <table className="gov-table">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Subsystem Component</th>
              <th>Status</th>
              <th>Latency (ms)</th>
              <th>Last Heartbeat</th>
              <th>Error Rate</th>
              <th>Model / Engine Version</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc, i) => (
              <tr key={i}>
                <td><strong>{svc.service}</strong></td>
                <td style={{ color: '#52606D' }}>{svc.subsystem}</td>
                <td><span className="badge badge-safe">{svc.status}</span></td>
                <td className="font-mono">{svc.latencyMs} ms</td>
                <td className="font-mono">{svc.lastHeartbeat}</td>
                <td className="font-mono">{svc.errorRatePercent.toFixed(2)}%</td>
                <td className="font-mono" style={{ color: '#1E40AF', fontSize: '11px' }}>{svc.modelVersion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};