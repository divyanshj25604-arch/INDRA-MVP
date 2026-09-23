import React, { useState } from 'react';
import {
  HelpCircle,
  Database,
  Cpu,
  GitBranch,
  ShieldCheck,
  RotateCcw,
  Activity,
  X,
} from 'lucide-react';
import {
  DataSourceStatus,
  ValidationMetric,
  FailureAnalysisCase,
  SystemServiceHealth,
} from '../types';
import { DataSourcesView } from '../pages/DataSourcesView';
import { HistoricalReplayView } from '../pages/HistoricalReplayView';
import { ModelValidationView } from '../pages/ModelValidationView';
import { SystemStatusView } from '../pages/SystemStatusView';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DataSourceStatus[];
  metrics: ValidationMetric[];
  failures: FailureAnalysisCase[];
  services: SystemServiceHealth[];
  defaultTab?: 'data' | 'ai_ml' | 'uncertainty' | 'risk' | 'validation' | 'diagnostics';
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  sources,
  metrics,
  failures,
  services,
  defaultTab = 'ai_ml',
}) => {
  const [activeSection, setActiveSection] = useState<
    'data' | 'ai_ml' | 'uncertainty' | 'risk' | 'validation' | 'diagnostics'
  >(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="methodology-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={17} className="text-info" />
            <div>
              <span className="modal-title">CIFS METHODOLOGY & SYSTEM ARCHITECTURE</span>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '1px' }}>
                Technical Deep Dive &bull; Data Pipelines &bull; Model Specifications &bull; Historical Validation
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher Navigation */}
        <div className="methodology-tabs-bar">
          {[
            { id: 'ai_ml', label: 'AI / ML MODELS', icon: <Cpu size={14} /> },
            { id: 'data', label: 'DATA SOURCES', icon: <Database size={14} /> },
            { id: 'uncertainty', label: 'UNCERTAINTY & ENSEMBLES', icon: <GitBranch size={14} /> },
            { id: 'risk', label: 'RISK INDEX FORMULATION', icon: <ShieldCheck size={14} /> },
            { id: 'validation', label: 'HISTORICAL VALIDATION', icon: <RotateCcw size={14} /> },
            { id: 'diagnostics', label: 'SYSTEM PIPELINE', icon: <Activity size={14} /> },
          ].map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`methodology-tab-btn ${isActive ? 'active' : ''}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {/* 1. AI / ML SPECIFICATIONS */}
          {activeSection === 'ai_ml' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  1. IDENTIFICATION ARCHITECTURE
                </h3>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>
                  Raw 4km geostationary thermal infrared (10.8 µm) radiances from INSAT-3D/3DR are calibrated and processed through a spatial convolutional backbone to segment convective clouds, extract vortex curvature patterns, and locate the storm center.
                </p>
                <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '10px' }}>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Input:</strong> INSAT-3D L1B TIR-1 (4km)
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Center Estimator:</strong> Circular Hough + Gradient Curvature
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Latency:</strong> 42 ms per 600&times;600 tile
                  </div>
                </div>
              </div>

              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  2. CLASSIFICATION & INTENSITY ESTIMATION
                </h3>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>
                  A multi-task deep neural network trained on historical North Indian Ocean cyclones estimates maximum sustained wind speed (km/h), central surface pressure (hPa), and maps them into official IMD intensity categories.
                </p>
                <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '10px' }}>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Backbone:</strong> Convolutional Feature Pyramid
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Mean Abs Error (Wind):</strong> ~6.4 km/h (Test Split)
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Eye Detection:</strong> Temperature Anomaly Core Test
                  </div>
                </div>
              </div>

              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  3. RAPID INTENSIFICATION (RI) DIAGNOSTIC
                </h3>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>
                  Couples thermodynamic ocean heat content (SST &gt; 29°C), vertical environmental wind shear (850–200 hPa &lt; 15 kt), and satellite structural compaction to evaluate the likelihood of strengthening &ge; 30 knots in 24 hours.
                </p>
                <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '10px' }}>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Predictors:</strong> 6h Wind, 12h Pressure, SST, Shear
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Classifier:</strong> Gradient Boosted Decision Ensemble
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '3px', border: '1px solid var(--border-light)' }}>
                    <strong>Label:</strong> Prototype Analytical Indicator
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DATA SOURCES */}
          {activeSection === 'data' && (
            <DataSourcesView sources={sources} />
          )}

          {/* 3. UNCERTAINTY & ENSEMBLES */}
          {activeSection === 'uncertainty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  ENSEMBLE CONE & PREDICTION REGION CALCULATION
                </h3>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5 }}>
                  The 80% forecast uncertainty cone displayed on the map is calculated from the dispersion of 50 ensemble trajectories. Rather than drawing a static deterministic line, the cone broadens over time as forward steering uncertainty accumulates:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', fontSize: '11px', marginTop: '10px' }}>
                  <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>T+12h RADIUS</span>
                    <div className="font-mono" style={{ fontWeight: 700 }}>&plusmn;40 km</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>T+24h RADIUS</span>
                    <div className="font-mono" style={{ fontWeight: 700 }}>&plusmn;65 km</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>T+48h RADIUS</span>
                    <div className="font-mono" style={{ fontWeight: 700 }}>&plusmn;110 km</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '8px', borderRadius: '3px' }}>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>T+72h RADIUS</span>
                    <div className="font-mono" style={{ fontWeight: 700 }}>&plusmn;160 km</div>
                  </div>
                </div>
              </div>

              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  KALMAN FILTER SHORT-TERM SMOOTHING (0–6H)
                </h3>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>
                  A linear Kalman filter recursively assimilates consecutive 30-minute INSAT-3D center estimates with forward inertial motion vectors to reduce satellite parallax jitter and high-frequency center wobble.
                </p>
              </div>
            </div>
          )}

          {/* 4. POST-LANDFALL RISK INDEX */}
          {activeSection === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="panel" style={{ padding: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
                  PROTOTYPE RISK INDEX FORMULATION
                </h3>
                <div style={{ background: '#F1F5F9', padding: '10px', borderRadius: '3px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#0F172A', marginBottom: '8px' }}>
                  Risk Index = [ Hazard (Wind + Rain + Surge) ] &times; [ Exposure (Pop + Infra) ] &times; [ Vulnerability ]
                </div>
                <p style={{ fontSize: '11px', color: '#52606D', lineHeight: 1.5, margin: 0 }}>
                  This analytical formula converts raw meteorological scenarios into district-level exposure priorities. It is explicitly a <strong>decision-support proxy</strong> and does not constitute official evacuation orders.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11px' }}>
                <div className="panel" style={{ padding: '10px' }}>
                  <strong>Hazard Weights:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '6px', color: '#52606D' }}>
                    <li>Peak Gusts: 40%</li>
                    <li>24h Rainfall: 35%</li>
                    <li>Surge Height: 25%</li>
                  </ul>
                </div>
                <div className="panel" style={{ padding: '10px' }}>
                  <strong>Exposure Layer:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '6px', color: '#52606D' }}>
                    <li>Census Population Count</li>
                    <li>Coastal Proximity (&lt;25km)</li>
                    <li>Critical Infrastructure</li>
                  </ul>
                </div>
                <div className="panel" style={{ padding: '10px' }}>
                  <strong>Classification:</strong>
                  <ul style={{ paddingLeft: '16px', marginTop: '6px', color: '#52606D' }}>
                    <li><span className="badge badge-danger">CRITICAL</span> &gt; 80/100</li>
                    <li><span className="badge badge-warn">HIGH</span> 60–80/100</li>
                    <li><span className="badge badge-info">MODERATE</span> &lt; 60/100</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 5. VALIDATION: Replay & Metrics */}
          {activeSection === 'validation' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                  HISTORICAL GROUND TRUTH BENCHMARK (CYCLONE FANI 2019)
                </h4>
                <HistoricalReplayView />
              </div>

              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
                  MODEL METRICS & FAILURE ANALYSIS
                </h4>
                <ModelValidationView
                  metrics={metrics}
                  failures={failures}
                  onOpenArchitectureModal={() => setActiveSection('ai_ml')}
                />
              </div>
            </div>
          )}

          {/* 6. SYSTEM DIAGNOSTICS & TELEMETRY */}
          {activeSection === 'diagnostics' && (
            <SystemStatusView services={services} />
          )}
        </div>
      </div>
    </div>
  );
};
